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
