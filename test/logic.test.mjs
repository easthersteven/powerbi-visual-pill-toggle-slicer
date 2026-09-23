import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTarget, findSelectedValue, basicFilter, coerceToFieldType, insertIndex } from "../.tmp/test-build/logic.js";

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

// ---- Always show default helpers ---------------------------------------------------

test("coerceToFieldType follows the host type descriptor", () => {
    assert.strictEqual(coerceToFieldType("0", ["1", "2"], { numeric: true }), 0);
    assert.strictEqual(coerceToFieldType(" 7 ", [], { integer: true }), 7);
    assert.strictEqual(coerceToFieldType("true", [], { bool: true }), true);
    assert.strictEqual(coerceToFieldType("False", [], { bool: true }), false);
    assert.strictEqual(coerceToFieldType("0", [1, 2], { text: true }), "0");
});

test("coerceToFieldType infers the type from the delivered values when the host gives none", () => {
    assert.strictEqual(coerceToFieldType("0", [1, 2, 3]), 0);
    assert.strictEqual(coerceToFieldType("0", [null, 3]), 0);
    assert.strictEqual(coerceToFieldType("true", [false]), true);
    assert.strictEqual(coerceToFieldType("0", ["A", "B"]), "0");
    assert.strictEqual(coerceToFieldType("0", []), "0");
});

test("coerceToFieldType leaves unparseable text alone", () => {
    assert.strictEqual(coerceToFieldType("abc", [1, 2]), "abc");
    assert.strictEqual(coerceToFieldType("", [1, 2]), "");
    assert.strictEqual(coerceToFieldType("maybe", [true]), "maybe");
});

test("insertIndex keeps an ascending or descending sequence in order", () => {
    assert.equal(insertIndex([1, 2, 3], 0), 0);
    assert.equal(insertIndex([1, 2, 3], 2.5), 2);
    assert.equal(insertIndex([1, 2, 3], 9), 3);
    assert.equal(insertIndex([3, 2, 1], 0), 3);
    assert.equal(insertIndex([3, 2, 1], 4), 0);
    assert.equal(insertIndex(["Actual", "Budget"], "Forecast"), 2);
    assert.equal(insertIndex(["Budget", "Forecast"], "Actual"), 0);
});

test("insertIndex appends when the values are not sorted, or when there are none", () => {
    assert.equal(insertIndex(["MTD", "QTD", "YTD", "Custom"], "Alpha"), 4);
    assert.equal(insertIndex([], 0), 0);
    assert.equal(insertIndex([5], 0), 0);
    assert.equal(insertIndex([5], 9), 1);
});
