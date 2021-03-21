import { window, workspace } from "vscode";
import flow = require("lodash.flow");
import getTextFromUrl from "./fileReader";
import { distinct } from "./utils/array";
import { parseCssTexts, getCSSRules, getCSSSelectors, getCSSClasses } from "./utils/css";

const classExtractor = flow(getCSSRules, getCSSSelectors, getCSSClasses, distinct);

export default async function (): Promise<string[]> {
    const config = workspace.getConfiguration("external-class-suggestions");
    const urls: string[] | undefined = config.get("externalStylesheets");
    if (!urls) {
        console.error("Configuration not set");
        return [];
    }

    try {
        const rawCss = await getTextFromUrl(urls);
        const cssTexts = parseCssTexts(rawCss);
        const distinctClasses = classExtractor(cssTexts);
        window.setStatusBarMessage(`CSS Classes successfully loaded`, 5000);
        return distinctClasses;
    } catch (e) {
        console.error(e);
        window.setStatusBarMessage("Failed to load CSS classes", 5000);
        return [] as string[];
    }
}
