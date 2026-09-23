import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTarget, findSelectedValue, basicFilter } from "../.tmp/test-build/logic.js";

test("parseTarget splits a query name into table and column", () => {
    assert.deepEqual(parseTarget("Options.Choice"), { table: "Options", column: "Choice" });
});

test("parseTarget keeps everything after the first dot as the column", () => {
    assert.deepEqual(parseTarget("T.Col.Sub"), { table: "T", column: "Col.Sub" });
});

test("parseTarget without a dot yields an empty table", () => {
    assert.deepEqual(parseTarget("Choice"), { table: "", column: "Choice" });
});

test("parseTarget handles undefined", () => {
    assert.deepEqual(parseTarget(undefined), { table: "", column: "" });
});

test("findSelectedValue returns the first value of the matching filter", () => {
    const filters = [
        { target: { table: "Other", column: "X" }, values: ["nope"] },
        { target: { table: "Options", column: "Choice" }, values: ["B", "C"] }
    ];
    assert.equal(findSelectedValue(filters, { table: "Options", column: "Choice" }), "B");
});

test("findSelectedValue matches on column alone when the target table is empty", () => {
    const filters = [{ target: { table: "Options", column: "Choice" }, values: ["B"] }];
    assert.equal(findSelectedValue(filters, { table: "", column: "Choice" }), "B");
});

test("findSelectedValue returns null when nothing matches", () => {
    assert.equal(findSelectedValue([], { table: "T", column: "C" }), null);
    assert.equal(findSelectedValue([{ target: { table: "T", column: "C" }, values: [] }], { table: "T", column: "C" }), null);
    assert.equal(findSelectedValue([null, {}], { table: "T", column: "C" }), null);
});

test("basicFilter builds a Basic In filter", () => {
    assert.deepEqual(basicFilter({ table: "T", column: "C" }, "A"), {
        $schema: "http://powerbi.com/product/schema#basic",
        target: { table: "T", column: "C" },
        operator: "In",
        values: ["A"],
        filterType: 1
    });
});
