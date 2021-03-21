import { window } from "vscode";
import flow = require("lodash.flow");
import getTextFromUrl from "./fileReader";
import { distinct } from "./utils/array";
import { parseCssTexts, getCSSRules, getCSSSelectors, getCSSClasses } from "./utils/css";

const classExtractor = flow(getCSSRules, getCSSSelectors, getCSSClasses, distinct);

export default async function (): Promise<string[]> {
    try {
        const rawCss = await getTextFromUrl([
            "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
        ]);
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
