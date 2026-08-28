# Changelog

## 1.4.0.0 (2026-08-28)

Built on main while the 1.3.0.0 review is in flight; not yet submitted. Pre-empts the
resize finding raised against Accent KPI Card on 27 August 2026, which this visual shares
the mechanics of.

- **Visible scroll bars.** The root was already `overflow: auto`, but on hosts with overlay
  scrollbars (WebView2 with Windows' "automatically hide scroll bars" default - Power BI
  Desktop) the bar occupies no layout space and paints nothing until the user scrolls, so a
  shrunken slicer looked clipped with no scroll bars. The scrollbar is now explicitly
  styled (standard `scrollbar-width`/`scrollbar-color`, plus `::-webkit-scrollbar` for
  older WebView2 hosts), which opts out of overlay rendering: a thin bar with a visible
  track renders whenever content overflows. Under high contrast the thumb and track follow
  the host palette.
- **Wrap long labels (Format pane > Shape).** Off by default (a long label widens its pill
  and the row wraps or scrolls). Turned on, the label breaks onto further lines inside its
  pill instead.
- **Scrolling now actually works inside Power BI Desktop.** The Desktop sandbox styles
  the element the visual renders into with `body.visual-sandbox #sandbox-host
  { overflow: hidden }` - an ID selector that outweighs the stylesheet's class rule, so
  the slicer's `overflow: auto` was silently overridden in Desktop and pills below the
  fold were unreachable. `overflow: auto` is now set as an inline style from the
  constructor, which no host stylesheet rule can beat. Pinned by a unit test.
- **Scrollbar styling corrected.** The standard `scrollbar-width`/`scrollbar-color`
  properties override `::-webkit-scrollbar` on Chromium and merely restyle the invisible
  overlay bar there, so they are now served to Firefox only
  (`@supports (-moz-appearance: none)`); the `::-webkit-scrollbar` rules force the real
  painted bar on Chromium/WebView2. Pinned by a unit test.
- **Top pill rows stay reachable.** The root centred the pill container with
  `align-items: center`; when the rows were taller than the visual, the overflow clipped
  at the top where scrolling cannot reach, hiding the first rows entirely. Auto margins
  now centre the container while it fits and collapse to zero when it overflows, so
  every row scrolls into view (policy 1180.2.2). Pinned by a unit test.
- **The default value is validated before it filters.** A configured default that matches
  none of the bound field's values (a typo, or a stale setting after the field changed)
  is ignored instead of filtering the whole report to nothing, and the filter carries the
  column's raw typed value, so numeric and date columns filter correctly.
- **Touch tooltips.** A tap on a pill shows the same tooltip as hovering - mousemove
  never fires on touch devices.

## 1.3.0.0 (2026-08-27)

Adds the text and shape controls the slicer was missing.

- **Font family.** A font picker sets the typeface for the whole slicer; it was hardcoded to
  Segoe UI in the stylesheet.
- **Unselected pill background and border colour** are now settable. They were fixed at
  `#FFFFFF` and `#C8C6C4` in the stylesheet, so an unselected pill could not be themed.
- **Corner radius** is settable, replacing the fixed 6px.
- High contrast mode drives the new colours from the host palette alongside the existing ones.
- Numeric settings are range-checked, so an out-of-range value from a hand-edited theme file
  falls back to the default instead of rendering an unusable slicer.
- A test asserts that every property declared in `capabilities.json` appears in the Format
  pane, so this cannot regress silently.

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
