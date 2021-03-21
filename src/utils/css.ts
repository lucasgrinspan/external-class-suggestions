import { parse, Stylesheet, Rule, Media } from "css";
import { flatten } from "./array";

export function parseCssTexts(cssTexts: string[]): Stylesheet[] {
    const stylesheets: Stylesheet[] = [];
    cssTexts.forEach((text) => {
        try {
            const parsedText = parse(text);
            stylesheets.push(parsedText);
        } catch (e) {
            console.error("error parsing CSS file");
        }
    });
    return stylesheets;
}

export function getCSSRules(styleSheets: Stylesheet[]): Rule[] {
    return styleSheets.reduce((acc, styleSheet) => {
        return acc.concat(findRootRules(styleSheet), findMediaRules(styleSheet));
    }, [] as Rule[]);
}

export function getCSSSelectors(rules: Rule[]): string[] {
    if (rules.length > 0) {
        return flatten(rules.map((rule) => (rule.selectors ? rule.selectors : []))).filter(
            (value) => value && value.length > 0
        );
    } else {
        return [];
    }
}

export function getCSSClasses(selectors: string[]): string[] {
    return selectors.reduce((acc, selector) => {
        const className = findClassName(selector);

        if (className && className.length > 0) {
            acc.push(sanitizeClassName(className));
        }

        return acc;
    }, [] as string[]);
}

export function findRootRules(cssAST: Stylesheet): Rule[] {
    if (!cssAST.stylesheet) {
        return [];
    }
    return cssAST.stylesheet.rules.filter((node) => (<Rule>node).type === "rule");
}

export function findMediaRules(cssAST: Stylesheet): Rule[] {
    if (!cssAST.stylesheet) {
        return [];
    }
    let mediaNodes = <Rule[]>cssAST.stylesheet.rules.filter((node) => {
        return (<Rule>node).type === "media";
    });

    if (mediaNodes.length > 0) {
        return flatten(
            mediaNodes.map((node) => {
                const mediaNode = <Media>node;
                if (mediaNode.rules) {
                    return mediaNode.rules;
                }
                return [];
            })
        );
    } else {
        return [];
    }
}

export function findClassName(selector: string): string {
    let classNameStartIndex = selector.lastIndexOf(".");
    if (classNameStartIndex >= 0) {
        let classText = selector.substr(classNameStartIndex + 1);
        // Search for one of ' ', '[', ':' or '>', that isn't escaped with a backslash
        let classNameEndIndex = classText.search(/[^\\][\s\[:>]/);
        if (classNameEndIndex >= 0) {
            return classText.substr(0, classNameEndIndex + 1);
        } else {
            return classText;
        }
    } else {
        return "";
    }
}

export function sanitizeClassName(className: string): string {
    return className.replace(/\\[!"#$%&'()*+,\-./:;<=>?@[\\\]^`{|}~]/g, (substr, ...args) => {
        if (args.length === 2) {
            return substr.slice(1);
        } else {
            return substr;
        }
    });
}
