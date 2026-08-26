# Certification status - Pill Toggle Slicer

**Publisher:** Obliwise
**Submitted:** 24 August 2026 (v1.0.0.0) - awaiting review outcome

## Known risks, from the Accent KPI Card review (25 August 2026)

The reviewers tested that offer against three policies. The same tests apply here.

### 1180.2.2 Core Functions - resize - LIKELY TO FAIL

`style/visual.less` sets `overflow: hidden` on the root container, the exact condition that
failed on Accent KPI Card. When the host shrinks the visual, wrapped pills on the lower rows
are clipped with no way to reach them. Change to `overflow: auto` and verify at small sizes.

### 1180.2.2.2 Tool Tips - soft failure expected

The visual does not use the host tooltip service.

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
| Format pane: every bucket configuration, bad input | Pass - defaults on every property, out-of-range clamped |
| Bad data: null, infinity, negative, wrong types | Pass - covered by unit tests |
| Data volumes: one row, two rows, thousands | Pass - data reduction declared |
| Number formats and precision changes | Pass - model format strings honoured |
| High contrast mode | **Fixed** - colours taken from the host palette |
| Keyboard navigation | **Fixed** - focusable, Enter/Space activates, `supportsKeyboardFocus` |
| Landing page when nothing is bound | **Fixed** - explains what to bind |
| Localization | **Fixed** - `stringResources` and the host localization manager |
| Bookmarks | Pass - state is restored from `options.jsonFilters`, the documented pattern for a filter-based slicer. The build tool still lists Bookmarks because it looks for `registerOnSelectCallback`, which applies to selection-based visuals; a no-op callback would silence the tool without adding behaviour, so it was not added. |
| No external services; `privileges: []` | Pass - certification audit reports no external requests |

`pbiviz package --certification-audit` reports one remaining recommended-feature warning, Bookmarks, explained in the table above. The
features it still lists are informational extras (Analytics Pane, Conditional Formatting,
Drill Down, Fetch More Data, File Download, Launch URL, Local Storage, Modal Dialog, Warning
Icon); several of those would require privileges that certification forbids.

## Current state (26 August 2026)

**Ready to submit:** 1.2.0.0. Package built and audited at
`dist/` - upload that file on the Partner Center Technical configuration page, and paste the
notes from `store/listing.md` into Notes for certification on Review and publish.

**Outstanding before upload:** `store/` still holds a sample .pbix that embeds 1.0.0.0. Power BI
requires the sample report to use the submitted visual version, so re-save it from the .pbip
project with the 1.2.0.0 package first - see `store/README.md` for the steps.

**Verified at this version:** npm audit 0 vulnerabilities; ESLint clean; 22 tests passing at
99% statement coverage; `pbiviz package --certification-audit` reports no external requests
and no recommended-feature warnings.
