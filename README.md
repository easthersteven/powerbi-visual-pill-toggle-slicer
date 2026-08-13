# Pill Toggle Slicer

A Power BI custom visual: a horizontal, pill-style, single-select slicer. Clicking a pill applies a Basic ("In") filter on the bound column; clicking the active pill again clears the filter. An optional default value can be enabled so the slicer loads with a selection and snaps back to it whenever the filter is cleared.

Because it applies a real filter (not a highlight), it works well with disconnected parameter tables driven by SELECTEDVALUE() measures.

## Features

- One pill per distinct value of the bound field, laid out horizontally with wrapping.
- Single-select behaviour: selecting a pill replaces the previous selection.
- Click the active pill to clear the selection.
- Optional default selection (Format pane, "Default" card): when enabled, the configured value is applied automatically whenever no filter is active.
- Format pane controls for font size, selected pill colour, selected text colour, and unselected text colour.
- Context menu support (right-click).

## Data roles

| Role | Kind | Description |
| --- | --- | --- |
| Field | Grouping | The column whose distinct values become pills. |

## Format options

| Card | Option | Description |
| --- | --- | --- |
| Text | Font size | Pill label size in pixels. |
| Colours | Selected pill | Background and border colour of the active pill. |
| Colours | Selected text | Text colour of the active pill. |
| Colours | Unselected text | Text colour of inactive pills. |
| Default | Enable default | Turns the default selection on. |
| Default | Default value | The value applied when no filter is active. Must exactly match one of the field's values. |

## Building from source

Prerequisites: Node.js 18 or later and npm.

```
npm install
npm run package
```

The packaged visual is written to `dist/*.pbiviz` and can be imported into Power BI Desktop or the Power BI service.

For development with live reload:

```
npm start
```

## Tests

Unit tests run on the Node.js test runner with jsdom and enforce a minimum statement coverage threshold:

```
npm test
```

## Linting

```
npm run lint
```

Linting uses eslint with eslint-plugin-powerbi-visuals.

## Repository layout

- `src/visual.ts` - the visual class (DOM rendering, filter application, formatting model).
- `src/logic.ts` - pure helper functions (filter target parsing, selected value detection, filter construction).
- `capabilities.json` - data roles, data view mappings, and format objects. Privileges are empty; the visual makes no external calls.
- `test/` - unit tests.

The `certification` branch contains the source matching the package submitted for Power BI certification.

## Support

Please report issues at https://github.com/easthersteven/powerbi-visual-pill-toggle-slicer/issues

## License

MIT, see LICENSE.
