"use strict";

import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import { parseTarget, findSelectedValue, basicFilter } from "./logic";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ITooltipService = powerbi.extensibility.ITooltipService;
import ISandboxExtendedColorPalette = powerbi.extensibility.ISandboxExtendedColorPalette;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import FilterAction = powerbi.FilterAction;
import DataView = powerbi.DataView;

function el(tag: string, cls?: string): HTMLElement { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function fill(o: Record<string, unknown> | undefined, k: string, d: string): string {
    return (o?.[k] as { solid?: { color?: string } })?.solid?.color || d;
}

export class Visual implements IVisual {
    private host: IVisualHost;
    private events: IVisualEventService;
    private selectionManager: ISelectionManager;
    private tooltipService: ITooltipService;
    private colorPalette: ISandboxExtendedColorPalette;
    private localization: ILocalizationManager;
    private root: HTMLElement;
    private lastFontSize = 11;
    private lastSel = "#1F908C";
    private lastSelText = "#FFFFFF";
    private lastBase = "#605E5C";
    private lastEnableDefault = false;
    private lastDefaultValue = "";

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.events = options.host.eventService;
        this.selectionManager = options.host.createSelectionManager();
        this.tooltipService = options.host.tooltipService;
        this.colorPalette = options.host.colorPalette as ISandboxExtendedColorPalette;
        this.localization = options.host.createLocalizationManager?.();
        this.root = options.element;
        this.root.classList.add("pill-toggle-root");
        this.root.addEventListener("contextmenu", (ev) => {
            this.selectionManager.showContextMenu({} as unknown as powerbi.visuals.ISelectionId, { x: ev.clientX, y: ev.clientY });
            ev.preventDefault();
        });
    }


    // Localized string with the English text as the fallback.
    private text(key: string, fallback: string): string {
        try {
            return this.localization?.getDisplayName(key) || fallback;
        } catch {
            return fallback;
        }
    }

    // Shown when no field is bound yet, so an empty slicer explains itself.
    private renderLandingPage(): void {
        const page = el("div", "pill-landing");
        const title = el("div", "pill-landing-title"); title.textContent = this.text("Landing_Title", "Pill Toggle Slicer");
        const body = el("div", "pill-landing-body");
        body.textContent = this.text("Landing_Body",
            "Bind a column to the Field bucket - each distinct value becomes a pill. Works best "
            + "with two to six values, such as a period or scenario switch.");
        page.appendChild(title); page.appendChild(body);
        this.root.appendChild(page);
    }

    public update(options: VisualUpdateOptions): void {
        this.events.renderingStarted(options);
        try {
            while (this.root.firstChild) this.root.removeChild(this.root.firstChild);
            const dv: DataView = options.dataViews?.[0];
            const cat = dv?.categorical?.categories?.[0];
            if (!cat || !cat.values?.length) {
                this.renderLandingPage();
                this.events.renderingFinished(options);
                return;
            }

            const o = dv.metadata?.objects?.["pill"] as Record<string, unknown> | undefined;
            let selColor = fill(o, "selectedColor", "#1F908C");
            let selText = fill(o, "selectedText", "#FFFFFF");
            let baseColor = fill(o, "color", "#605E5C");
            const fontSize = (o?.["fontSize"] as number) ?? 11;
            const enableDefault = (o?.["enableDefault"] as boolean) ?? false;
            const defaultValue = (o?.["defaultValue"] as string) ?? "";
            this.lastFontSize = fontSize;
            // High contrast mode: colours come from the host palette, and the selected pill is
            // inverted so selection stays visible in a two-colour theme.
            if (this.colorPalette?.isHighContrast === true) {
                const fore = this.colorPalette.foreground?.value;
                const back = this.colorPalette.background?.value;
                selColor = fore; selText = back; baseColor = fore;
                this.root.style.background = back;
            } else {
                this.root.style.background = "";
            }

            this.lastSel = selColor; this.lastSelText = selText; this.lastBase = baseColor;
            this.lastEnableDefault = enableDefault; this.lastDefaultValue = defaultValue;

            // Resolve the bound table/column (e.g. "Options.Choice") so a real Basic filter can be
            // applied. A slicer must FILTER, not highlight, so that measures using SELECTEDVALUE()
            // over a disconnected parameter table respond to it.
            const target = parseTarget(cat.source.queryName as string | undefined);

            // Which value is currently filtered (to mark the active pill).
            let selectedVal = findSelectedValue((options.jsonFilters as unknown[]) || [], target);

            // DEFAULT (opt-in): if nothing is selected and a default is enabled, auto-apply it. This makes
            // the toggle load on the default and, when cleared, snap back to it. The selectedVal == null
            // guard stops it re-firing once the filter is set.
            if (enableDefault && defaultValue && selectedVal == null && target.column) {
                this.host.applyJsonFilter(basicFilter(target, defaultValue) as unknown as powerbi.IFilter, "general", "filter", FilterAction.merge);
                selectedVal = defaultValue;
            }

            const wrap = el("div", "pill-toggle");
            cat.values.forEach((v) => {
                const val = String(v ?? "");
                const isSel = selectedVal != null && val === selectedVal;
                const pill = el("button", "pill" + (isSel ? " sel" : ""));
                pill.textContent = val;
                pill.style.fontSize = fontSize + "px";
                if (isSel) { pill.style.background = selColor; pill.style.color = selText; pill.style.borderColor = selColor; }
                else { pill.style.color = baseColor; }
                // Host tooltip on hover, naming the bound field (policy 1180.2.2.2).
                pill.addEventListener("mousemove", (ev) => {
                    const rect = this.root.getBoundingClientRect();
                    this.tooltipService?.show({
                        coordinates: [ev.clientX - rect.left, ev.clientY - rect.top],
                        isTouchEvent: false,
                        dataItems: [{
                            displayName: cat.source.displayName ?? "Value",
                            value: val,
                        }, {
                            displayName: "Selection",
                            value: isSel
                                ? this.text("Tooltip_Selected", "selected - click to clear")
                                : this.text("Tooltip_Unselected", "click to filter the page"),
                        }],
                        identities: [],
                    });
                });
                pill.addEventListener("mouseleave", () => this.tooltipService?.hide({ immediately: true, isTouchEvent: false }));
                pill.addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    // Honour the report's Edit interactions setting.
                    if (!target.column || this.host.hostCapabilities?.allowInteractions === false) return;
                    // click the active pill again to clear (back to the unfiltered state)
                    const action = isSel ? FilterAction.remove : FilterAction.merge;
                    this.host.applyJsonFilter(basicFilter(target, v) as unknown as powerbi.IFilter, "general", "filter", action);
                });
                wrap.appendChild(pill);
            });
            this.root.appendChild(wrap);
            this.events.renderingFinished(options);
        } catch (e) {
            this.events.renderingFailed(options, String(e));
        }
    }

    private colorSlice(uid: string, name: string, prop: string, val: string): powerbi.visuals.FormattingSlice {
        return {
            uid, displayName: name,
            control: {
                type: powerbi.visuals.FormattingComponent.ColorPicker,
                properties: { descriptor: { objectName: "pill", propertyName: prop }, value: { value: val } }
            }
        };
    }
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return {
            cards: [
                {
                    uid: "pillCard", displayName: "Text",
                    groups: [{ uid: "pillTextGroup", displayName: "Text", slices: [{
                        uid: "pillFontSizeSlice", displayName: "Font size",
                        control: { type: powerbi.visuals.FormattingComponent.NumUpDown, properties: { descriptor: { objectName: "pill", propertyName: "fontSize" }, value: this.lastFontSize } }
                    }] }]
                },
                {
                    uid: "pillColoursCard", displayName: "Colours",
                    groups: [{ uid: "pillColoursGroup", displayName: "Colours", slices: [
                        this.colorSlice("pSel", "Selected pill", "selectedColor", this.lastSel),
                        this.colorSlice("pSelText", "Selected text", "selectedText", this.lastSelText),
                        this.colorSlice("pBase", "Unselected text", "color", this.lastBase)
                    ] }]
                },
                {
                    uid: "pillDefaultCard", displayName: "Default",
                    groups: [{ uid: "pillDefaultGroup", displayName: "Default", slices: ([
                        {
                            uid: "pillEnableDefault", displayName: "Enable default",
                            control: { type: powerbi.visuals.FormattingComponent.ToggleSwitch, properties: { descriptor: { objectName: "pill", propertyName: "enableDefault" }, value: this.lastEnableDefault } }
                        },
                        {
                            uid: "pillDefaultValue", displayName: "Default value",
                            control: { type: powerbi.visuals.FormattingComponent.TextInput, properties: { descriptor: { objectName: "pill", propertyName: "defaultValue" }, value: this.lastDefaultValue, placeholder: "" } }
                        }
                    ] as powerbi.visuals.FormattingSlice[]) }]
                }
            ]
        };
    }
}
