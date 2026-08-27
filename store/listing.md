# Partner Center listing - Pill Toggle Slicer

Paste-ready values for the AppSource offer. Field limits are shown in brackets.

**Offer ID** (lowercase, no spaces): `pill-toggle-slicer`

**Name** (50 chars max): Pill Toggle Slicer

**Summary** (100 chars max, one sentence):
Compact pill style single select slicer. One click filters the whole report to the chosen value.

**Description** (3,000 chars max, rich text allowed):

Pill Toggle Slicer replaces the standard slicer with a row of compact pills, ideal for the small, always visible choices that drive a report: time grain, region, scenario, business unit.

Key features:

- **One click filtering.** Each pill applies a basic filter on the bound field. Selection is single select by design, so the report always reflects exactly one choice.
- **Compact.** A full slicer in a strip a single line tall. Pills wrap onto extra lines if the visual is narrow.
- **Configurable default.** Choose which value is selected when the report opens, so viewers always land on the intended view.
- **Styleable.** Font family and size, selected and unselected pill colours, text colours, border colour and corner radius are all set in the Format pane, so the pills match your report theme.
- **Certified friendly.** No external services, no data leaves your report, and the visual supports the Rendering Events API and context menus.

Use it wherever a row of pills reads better than a dropdown: month/quarter/year switches, region pickers, actual vs budget scenarios and similar small sets of options.

**Search keywords** (up to 3): slicer, toggle, filter

**Help link:** https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer#readme
**Privacy policy link:** https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer/blob/main/PRIVACY.md
**Support document link:** https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer/blob/main/SUPPORT.md
**Support (issues) link:** https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer/issues

**Media:**
- Logo 300x300: `store/icon-300x300.png`
- Screenshot 1366x768 (PNG, under 1024 kb): `store/screenshot-1366x768.png`
  Suggested caption: "Single select pill slicers with a configurable default selection and theme matched colours."

**Properties page:**
- Category (max 2): Filters
- Industry (max 2): leave empty - the visual is not industry-specific
- EULA: use the Standard Contract for Microsoft's commercial marketplace
- Privacy policy link: https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer/blob/main/PRIVACY.md
- Support document link: https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer/blob/main/SUPPORT.md

**Technical configuration page:**
- PBIVIZ package: `dist/pillToggleSlicer17CF177366264F91B44C2C53979DB313.1.3.0.0.pbiviz`
  (full path: `C:\Users\se518\powerbi-visuals\powerbi-visual-pill-toggle-slicer\dist\pillToggleSlicer17CF177366264F91B44C2C53979DB313.1.3.0.0.pbiviz`)
- Sample PBIX: `store/pill-toggle-slicer-sample.pbix` - must open offline with no external
  connections, embed its own sample data, and use this exact visual version.

**Certification:**
1. Offer setup page: tick **Request Power BI certification**.
2. Review and publish page, **Notes for certification** box, paste everything
   between the rules below (reviewer-facing only - nothing in it is a note to self):

   ---
   Pill Toggle Slicer 1.3.0.0 - Product ID 9ee18d59-7997-4d34-8562-da3d2c94a1b2
   Supersedes 1.0.0.0, reviewed 26 August 2026.

   SOURCE AND BUILD
   Repository: https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer
   Branch: certification - byte-identical to main and to the submitted package.
   Access: public repository, no credentials required.
   Build: npm install, then npm run package.
   Tooling: powerbi-visuals-tools 7.2.1, API 5.11.0.

   RESPONSE TO THE REVIEW OF 26 AUGUST 2026
   1180.2.2.2 tool tips - fixed. Hovering a pill shows the bound field's name and the
   pill's value through the host tooltip service, plus a line stating whether clicking
   will filter or clear.
   1180.2.3 sample file - fixed. The .pbiviz and the visual embedded in the sample .pbix
   are both 1.3.0.0. The previous submission held packages built from two different
   versions in the two slots.

   ALSO IN THIS VERSION
   The Format pane gains a font family picker, an unselected pill background, a border
   colour and a corner radius; those parts of the slicer previously could not be themed.
   Numeric settings are range-checked, so an out-of-range value falls back to its default
   rather than rendering an unusable slicer.

   HOST BEHAVIOUR AND ACCESSIBILITY
   The slicer applies a real basic filter on the bound column through applyJsonFilter, so
   every other visual on the page responds, including native ones, and measures using
   SELECTEDVALUE() over a disconnected table react to it. It declares
   supportsSynchronizingFilterState and participates in filter synchronisation like a
   native slicer. The root container is overflow:auto, so pills wrapped onto lower rows
   stay reachable when the visual is shrunk. High contrast mode takes its colours from
   the host palette and inverts the selected pill so selection stays visible in a
   two-colour theme. Pills are focusable and Enter or Space activates them;
   supportsKeyboardFocus is declared. Honours the report's Edit interactions setting, and
   supports the Rendering Events API and context menus. Strings are localised through
   stringResources and the host localization manager, and a landing page explains the
   visual when nothing is bound.

   NOTE ON THE BOOKMARKS FEATURE CHECK
   pbiviz package --certification-audit lists Bookmarks as a recommended feature. The
   check looks for registerOnSelectCallback, which applies to selection-based visuals.
   This is a filter-based slicer: it restores its state from options.jsonFilters, the
   documented pattern for filter visuals, so bookmarks and cross-report filter state work
   correctly. A no-op callback would silence the check without adding behaviour, so it
   was not added.

   SECURITY AND PRIVACY
   No external services and no network calls of any kind; no data leaves the report.
   capabilities.json declares "privileges": []. pbiviz package --certification-audit
   reports no external requests. npm audit reports 0 vulnerabilities. 25 unit tests pass.

   SAMPLE FILE
   pill-toggle-slicer-sample.pbix opens offline: the model is import-mode with inline
   sample data, with no data sources, connectors or credentials. It embeds visual version
   1.3.0.0, matching the submitted .pbiviz. Page 1 puts the slicer above a native column
   chart so filtering is visible, with the default selection set to MTD - clearing the
   filter reapplies it. Page 2 documents the settings.
   ---

**Pre-publish checks (27 Aug 2026, v1.3.0.0):** npm audit 0 vulnerabilities; eslint
clean; unit tests pass; certification audit found no external requests; logo 300x300 and
screenshot 1366x768 within size limits; main and certification branches identical.
