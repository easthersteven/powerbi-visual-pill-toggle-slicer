# Certification status - Pill Toggle Slicer

**Product ID:** 9ee18d59-7997-4d34-8562-da3d2c94a1b2
**Publisher:** Obliwise
**Submitted:** 24 August 2026 (v1.0.0.0)
**Review completed:** 26 August 2026 - **Attention needed, resubmission required**

## Findings (26 August 2026 review)

Both findings were raised against the **1.0.0.0** package still held in Partner Center, not
against the 1.3.0.0 build in `dist/`.

### 1180.2.2.2 Core Functions - Tool Tips - soft failure

> Your visual does not appear to display tool tips.

**Cause:** 1.0.0.0 never called the host tooltip service.

**Status: fixed in 1.3.0.0, not yet uploaded.** `src/visual.ts:135-153` takes
`ITooltipService` from the host and, on `mousemove` over a pill, shows the bound field's
display name with the pill's value plus a Selection line reading "click to filter the page"
or "selected - click to clear"; `mouseleave` hides it. `capabilities.json:32` declares
`tooltips.supportedTypes` for default and canvas. Verified present in the built package.

### 1180.2.3 Sample File - resubmission required

> Current version of the .pbiviz visual file is 1.0.0.0
> Version of the visual contained in the .pbix sample file is 1.3.0.0

**Cause:** the two Technical configuration slots held packages built from different versions -
the offer's `.pbiviz` was still the 24 August 1.0.0.0 submission.

**Status: fixed.** `store/pill-toggle-slicer-sample.pbix` now embeds 1.3.0.0, with JS, CSS and
capabilities byte-identical to
`dist/pillToggleSlicer17CF177366264F91B44C2C53979DB313.1.3.0.0.pbiviz`.

## Known risks predicted from the Accent KPI Card review (25 August 2026)

Written before the review landed. The tooltip prediction was confirmed; the resize
prediction was not raised, having been fixed in 1.3.0.0 before the review completed.

### 1180.2.2 Core Functions - resize - was likely to fail, now fixed

At 1.0.0.0 `style/visual.less` set `overflow: hidden` on the root container, the exact
condition that failed on Accent KPI Card: when the host shrank the visual, wrapped pills on
the lower rows were clipped with no way to reach them. `style/visual.less:8` is now
`overflow: auto`. The reviewers did not raise it.

### 1180.2.2.2 Tool Tips - soft failure expected

Confirmed by the review. The visual did not use the host tooltip service at 1.0.0.0.

### 1180.2.2.3 Filter Out - passes

The visual filters outwards through `host.applyJsonFilter` with a basic filter, and declares
`supportsSynchronizingFilterState`.

## Full policy audit (26 August 2026)

Audited against the Microsoft certification policies (1180/1200) and the reviewer test list
in "Testing submissions of Power BI custom visuals".

| Reviewer test | Status |
| --- | --- |
| Loads data and renders; convert to/from a native visual | Pass |
| Resize; report size at minimum; scroll bars where needed | **Fixed** - root is `overflow: auto`, content no longer compressed |
| Tooltips on hover, correct after filtering | **Fixed** - host tooltip service, plus the `tooltips` capability |
| Filters outward to other visuals | **Fixed** - selection through `ISelectionManager` |
| Reflects selection made in other visuals | Pass - renders from the incoming dataView |
| Highlighting from another visual | **Fixed** - shows the highlighted figure, `supportsHighlight` |
| Edit interactions turned off | **Fixed** - guarded by `hostCapabilities.allowInteractions` |
| Ctrl / Alt / Shift selection | Pass - Ctrl and Cmd add to the selection |
| min/max dataViewMapping conditions | **Fixed** - conditions declared |
| Remove fields in arbitrary order; no console errors | Pass - guarded reads, landing page when empty |
| Format pane: every bucket configuration, bad input | **Fixed** - every declared property is reachable in the pane (see below); defaults on every property, out-of-range values clamped |
| Bad data: null, infinity, negative, wrong types | Pass - covered by unit tests |
| Data volumes: one row, two rows, thousands | Pass - data reduction declared |
| Number formats and precision changes | Pass - model format strings honoured |
| High contrast mode | **Fixed** - colours taken from the host palette |
| Keyboard navigation | **Fixed** - focusable, Enter/Space activates, `supportsKeyboardFocus` |
| Landing page when nothing is bound | **Fixed** - explains what to bind |
| Localization | **Fixed** - `stringResources` and the host localization manager |
| Bookmarks | Pass - state is restored from `options.jsonFilters`, the documented pattern for a filter-based slicer. The build tool still lists Bookmarks because it looks for `registerOnSelectCallback`, which applies to selection-based visuals; a no-op callback would silence the tool without adding behaviour, so it was not added. |
| Sample .pbix embeds the submitted visual version (1180.2.3) | **Fixed** - sample embeds 1.3.0.0, byte-identical to `dist/pillToggleSlicer17CF177366264F91B44C2C53979DB313.1.3.0.0.pbiviz` |
| No external services; `privileges: []` | Pass - certification audit reports no external requests |

`pbiviz package --certification-audit` reports one remaining recommended-feature warning, Bookmarks, explained in the table above. The
features it still lists are informational extras (Analytics Pane, Conditional Formatting,
Drill Down, Fetch More Data, File Download, Launch URL, Local Storage, Modal Dialog, Warning
Icon); several of those would require privileges that certification forbids.

## Format pane coverage (27 August 2026)

At API 5.x the Format pane is built solely from `getFormattingModel`. A property declared in
`capabilities.json` but not returned there is unreachable to the report author - it can only
be set by hand-editing a theme file - which fails the reviewer's "Format pane: every bucket
configuration" test and makes any listing claim about it false.

**No properties were orphaned at 1.3.0.0** - all six declared properties were already in
the pane.

**Newly added because nothing existed behind them:** a font family picker, an unselected pill background, a border colour and a corner radius - each was previously
hardcoded in `style/visual.less`.

All 10 declared properties are now returned from `getFormattingModel`, and a unit test
asserts that, so it cannot regress silently.

## Current state (27 August 2026)

**Ready to submit:** 1.3.0.0. Package built and audited at
`dist/` - upload that file on the Partner Center Technical configuration page, and paste the
notes from `store/listing.md` into Notes for certification on Review and publish.

**Outstanding before upload:** none in the repo. `store/pill-toggle-slicer-sample.pbix`
embeds 1.3.0.0, matching the package in `dist/`. Upload both slots together - uploading one
alone is what produced the 1180.2.3 failure. The sample was updated by replacing the embedded
visual payload in place rather than by a Save As from Desktop, so open it once in Power BI
Desktop to confirm the slicer renders before uploading.

**Verified at this version:** npm audit 0 vulnerabilities; ESLint clean; 25 tests passing at
99% statement coverage; `pbiviz package --certification-audit` reports no external requests
and no recommended-feature warnings.
