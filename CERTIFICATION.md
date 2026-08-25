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
