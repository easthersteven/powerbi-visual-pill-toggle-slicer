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
2. Review and publish page, **Notes for certification** box, paste:

   Source code: https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer
   Branch: certification (matches the submitted package exactly)
   Access: public repository, no credentials required.
   Build: npm install, then npm run package (powerbi-visuals-tools 7.2.1, API 5.11.0).
   Verified: npm audit clean, eslint clean, `pbiviz package --certification-audit`
   reports no external requests, capabilities declare `"privileges": []`.

**Pre-publish checks (27 Aug 2026, v1.3.0.0):** npm audit 0 vulnerabilities; eslint
clean; unit tests pass; certification audit found no external requests; logo 300x300 and
screenshot 1366x768 within size limits; main and certification branches identical.
