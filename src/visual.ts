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
        this.root = options.element;
        this.root.classList.add("pill-toggle-root");
        this.root.addEventListener("contextmenu", (ev) => {
            this.selectionManager.showContextMenu({} as unknown as powerbi.visuals.ISelectionId, { x: ev.clientX, y: ev.clientY });
            ev.preventDefault();
        });
    }

    public update(options: VisualUpdateOptions): void {
        this.events.renderingStarted(options);
        try {
            while (this.root.firstChild) this.root.removeChild(this.root.firstChild);
            const dv: DataView = options.dataViews?.[0];
            const cat = dv?.categorical?.categories?.[0];
            if (!cat || !cat.values?.length) { this.events.renderingFinished(options); return; }

            const o = dv.metadata?.objects?.["pill"] as Record<string, unknown> | undefined;
            const selColor = fill(o, "selectedColor", "#1F908C");
            const selText = fill(o, "selectedText", "#FFFFFF");
            const baseColor = fill(o, "color", "#605E5C");
            const fontSize = (o?.["fontSize"] as number) ?? 11;
            const enableDefault = (o?.["enableDefault"] as boolean) ?? false;
            const defaultValue = (o?.["defaultValue"] as string) ?? "";
            this.lastFontSize = fontSize;
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
                pill.addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    if (!target.column) return;
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
