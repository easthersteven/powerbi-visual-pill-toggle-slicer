// Pure, testable helpers for the Pill Toggle Slicer visual (no DOM or Power BI dependencies).

export interface FilterTarget { table: string; column: string; }

// Split a bound column's query name (e.g. "Options.Choice") into a filter target.
export function parseTarget(queryName: string | undefined): FilterTarget {
    const qn = queryName || "";
    const dot = qn.indexOf(".");
    return dot >= 0
        ? { table: qn.substring(0, dot), column: qn.substring(dot + 1) }
        : { table: "", column: qn };
}

// Find the currently applied value for the bound column among the visual's JSON filters.
export function findSelectedValue(filters: unknown[], target: FilterTarget): string | null {
    for (const f of (filters || []) as Array<{ target?: { table?: string; column?: string }; values?: unknown[] }>) {
        const t = f?.target;
        if (t && t.column === target.column && (t.table === target.table || !target.table) && Array.isArray(f.values) && f.values.length) {
            return String(f.values[0]);
        }
    }
    return null;
}

export interface BasicFilter {
    $schema: string;
    target: FilterTarget;
    operator: "In";
    values: unknown[];
    filterType: number;
}

// Build a Basic ("In") JSON filter for one value of the bound column.
export function basicFilter(target: FilterTarget, value: unknown): BasicFilter {
    return {
        // Standard Power BI filter schema identifier (a constant, never fetched).
        // eslint-disable-next-line powerbi-visuals/no-http-string
        $schema: "http://powerbi.com/product/schema#basic",
        target,
        operator: "In",
        values: [value],
        filterType: 1
    };
}

// The host describes the bound column's type on the category source (ValueTypeDescriptor).
export interface FieldType { numeric?: boolean; integer?: boolean; bool?: boolean; text?: boolean; dateTime?: boolean; }

// Convert the Format pane's default text to the bound column's value type, so a default that is
// absent from the data still filters a numeric or boolean column with a typed value. The host's
// type descriptor wins; without one, the type of the first delivered value is used. Anything
// that does not parse is left as text.
export function coerceToFieldType(text: string, sampleValues: unknown[], sourceType?: FieldType): unknown {
    const described = !!sourceType && !!(sourceType.numeric || sourceType.integer || sourceType.bool || sourceType.text || sourceType.dateTime);
    const sample = (sampleValues || []).find((v) => v !== null && v !== undefined);
    const numeric = described ? !!(sourceType.numeric || sourceType.integer) : typeof sample === "number";
    const bool = described ? !!sourceType.bool : typeof sample === "boolean";
    const trimmed = text.trim();
    if (numeric) {
        const n = Number(trimmed);
        return trimmed !== "" && isFinite(n) ? n : text;
    }
    if (bool) {
        const t = trimmed.toLowerCase();
        return t === "true" ? true : t === "false" ? false : text;
    }
    return text;
}

function compareValues(a: unknown, b: unknown): number {
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a ?? "").localeCompare(String(b ?? ""), undefined, { numeric: true });
}

// Where an absent default pill belongs among the delivered values: in sequence when they arrive
// sorted (ascending or descending), otherwise after them.
export function insertIndex(values: unknown[], value: unknown): number {
    let asc = true, desc = true;
    for (let i = 1; i < values.length; i++) {
        const c = compareValues(values[i - 1], values[i]);
        if (c > 0) asc = false;
        if (c < 0) desc = false;
    }
    if (asc) {
        const i = values.findIndex((v) => compareValues(value, v) < 0);
        return i < 0 ? values.length : i;
    }
    if (desc) {
        const i = values.findIndex((v) => compareValues(value, v) > 0);
        return i < 0 ? values.length : i;
    }
    return values.length;
}
