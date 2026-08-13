import { test } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>");
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;

const { Visual } = await import("../.tmp/test-build/visual.js");

function makeHost(captured) {
    return {
        eventService: {
            renderingStarted: () => captured.events.push("started"),
            renderingFinished: () => captured.events.push("finished"),
            renderingFailed: (_o, e) => captured.events.push("failed:" + e)
        },
        createSelectionManager: () => ({
            showContextMenu: () => { captured.contextMenus++; },
            clear: () => Promise.resolve(),
            select: () => Promise.resolve()
        }),
        applyJsonFilter: (filter, objectName, propertyName, action) => {
            captured.filters.push({ filter, objectName, propertyName, action });
        }
    };
}

function makeVisual() {
    const captured = { events: [], filters: [], contextMenus: 0 };
    const element = document.createElement("div");
    document.body.appendChild(element);
    const visual = new Visual({ host: makeHost(captured), element });
    return { visual, element, captured };
}

function dataView(values, objects) {
    return {
        metadata: { objects },
        categorical: { categories: [{ source: { queryName: "Options.Choice", displayName: "Choice" }, values }] }
    };
}

test("renders one pill per category value and raises rendering events", () => {
    const { visual, element, captured } = makeVisual();
    visual.update({ dataViews: [dataView(["A", "B", "C"])], jsonFilters: [] });
    assert.equal(element.querySelectorAll("button.pill").length, 3);
    assert.deepEqual(captured.events, ["started", "finished"]);
});

test("renders nothing and still finishes when there is no data", () => {
    const { visual, element, captured } = makeVisual();
    visual.update({ dataViews: [], jsonFilters: [] });
    assert.equal(element.querySelectorAll("button.pill").length, 0);
    assert.deepEqual(captured.events, ["started", "finished"]);
});

test("clicking a pill applies a Basic In filter for the bound column", () => {
    const { visual, element, captured } = makeVisual();
    visual.update({ dataViews: [dataView(["A", "B"])], jsonFilters: [] });
    element.querySelectorAll("button.pill")[1].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    assert.equal(captured.filters.length, 1);
    const applied = captured.filters[0];
    assert.deepEqual(applied.filter.target, { table: "Options", column: "Choice" });
    assert.deepEqual(applied.filter.values, ["B"]);
    assert.equal(applied.action, 0); // FilterAction.merge
});

test("the filtered value renders as selected and clicking it removes the filter", () => {
    const { visual, element, captured } = makeVisual();
    const applied = [{ target: { table: "Options", column: "Choice" }, values: ["B"] }];
    visual.update({ dataViews: [dataView(["A", "B"])], jsonFilters: applied });
    const pills = element.querySelectorAll("button.pill");
    assert.equal(pills[0].classList.contains("sel"), false);
    assert.equal(pills[1].classList.contains("sel"), true);
    pills[1].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    assert.equal(captured.filters.length, 1);
    assert.equal(captured.filters[0].action, 1); // FilterAction.remove
});

test("applies the default value when enabled and nothing is selected", () => {
    const { visual, element, captured } = makeVisual();
    const objects = { pill: { enableDefault: true, defaultValue: "A" } };
    visual.update({ dataViews: [dataView(["A", "B"], objects)], jsonFilters: [] });
    assert.equal(captured.filters.length, 1);
    assert.deepEqual(captured.filters[0].filter.values, ["A"]);
    assert.equal(element.querySelectorAll("button.pill")[0].classList.contains("sel"), true);
});

test("does not reapply the default once a filter is present", () => {
    const { visual, captured } = makeVisual();
    const objects = { pill: { enableDefault: true, defaultValue: "A" } };
    const applied = [{ target: { table: "Options", column: "Choice" }, values: ["B"] }];
    visual.update({ dataViews: [dataView(["A", "B"], objects)], jsonFilters: applied });
    assert.equal(captured.filters.length, 0);
});

test("getFormattingModel exposes text, colour, and default cards", () => {
    const { visual } = makeVisual();
    const model = visual.getFormattingModel();
    assert.equal(model.cards.length, 3);
});

test("right-click opens the context menu", () => {
    const { visual, element, captured } = makeVisual();
    visual.update({ dataViews: [dataView(["A"])], jsonFilters: [] });
    element.dispatchEvent(new dom.window.MouseEvent("contextmenu", { bubbles: true }));
    assert.equal(captured.contextMenus, 1);
});
