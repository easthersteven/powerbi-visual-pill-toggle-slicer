# Changelog

## 1.2.0.0 (2026-08-26)

Audited against the Microsoft certification policies and the reviewer test list after the
Accent KPI Card review returned findings against the same policies.

- **Resizing (1180.2.2).** Scrolls instead of clipping when the host shrinks the visual.
- **Tooltips (1180.2.2.2).** Host tooltips on hover, and the `tooltips` capability declared.
- **Accessibility.** High contrast colours come from the host palette; interactive elements
  are keyboard reachable and activate with Enter or Space (`supportsKeyboardFocus`).
- **Interaction correctness.** Honours the report's Edit interactions setting.
- **Landing page.** Explains what to bind when no fields are present.
- **Localization.** String resources and the host localization manager.
- **dataViewMapping conditions** declared, so field buckets accept the intended cardinality.

## 1.0.0.0 (2026-08-13)

- Initial public release.
- Horizontal single-select pill slicer applying a Basic filter on the bound column.
- Optional default selection that reapplies when the filter is cleared.
- Format pane controls for font size, pill colours, and the default value.
- Rendering Events API support and context menu support.
