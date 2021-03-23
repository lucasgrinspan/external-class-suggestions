import * as assert from "assert";
import {
    parseCssTexts,
    findClassName,
    findMediaRules,
    findRootRules,
    getCSSClasses,
    getCSSRules,
    getCSSSelectors,
    sanitizeClassName,
} from "../../utils/css";

suite("css", () => {
    suite("parseCssTexts", () => {
        test("should return stylesheet objects", () => {
            const stylesheets = [".container {}", ".test {}"];
            const results = parseCssTexts(stylesheets);
            results.forEach((result) => {
                const type = result.type;
                assert.strictEqual(type, "stylesheet");
            });
        });
    });

    suite("findClassName", () => {
        test("should correctly return the class name from a selector", () => {
            const selector = ".container";
            const result = findClassName(selector);
            assert.strictEqual(result, "container");
        });

        test("should correctly return the class name with joint selectors", () => {
            const selector = "div .test>#id";
            const result = findClassName(selector);
            assert.strictEqual(result, "test");
        });
    });

    suite("findMediaRules", () => {
        test("should correctly return media rules", () => {
            const css = ["@media only screen { .container {}}", "@media not print { .test {}}"];
            const stylesheets = parseCssTexts(css);
            stylesheets.forEach((stylesheet) => {
                const rules = findMediaRules(stylesheet);
                assert.strictEqual(rules.length, 1);
            });
        });

        test("should return an empty array when there are no media rules", () => {
            const css = [".container {}", ".test {}", "#test {}"];
            const stylesheets = parseCssTexts(css);
            stylesheets.forEach((stylesheet) => {
                const rules = findMediaRules(stylesheet);
                assert.strictEqual(rules.length, 0);
            });
        });
    });

    suite("findRootRules", () => {
        test("should correctly return the root rules", () => {
            const css = [".container {}", ".test{}", "#test {}"];
            const stylesheets = parseCssTexts(css);
            stylesheets.forEach((stylsheet) => {
                const rootRules = findRootRules(stylsheet);
                assert.strictEqual(rootRules.length, 1);
            });
        });

        test("should return an empty array when there are no root rules", () => {
            const css = ["@media only screen { .container {} }", "@media not print { .test {} }"];
            const stylesheets = parseCssTexts(css);
            stylesheets.forEach((stylesheet) => {
                const rootRules = findRootRules(stylesheet);
                assert.strictEqual(rootRules.length, 0);
            });
        });
    });

    suite("getCSSClasses", () => {
        test("should return the class names from the selectors", () => {
            const selectors = [".container", ".test", ".vscode"];
            const classes = getCSSClasses(selectors);
            assert.strictEqual(classes.length, 3);
            assert.strictEqual(classes[0], "container");
        });

        test("should not return any class names if there are no classes in the selectors", () => {
            const selectors = ["form", "#row", "div > form"];
            const classes = getCSSClasses(selectors);
            assert.strictEqual(classes.length, 0);
        });
    });

    suite("getCSSRules", () => {
        test("should return the correct amount of CSS rules", () => {
            const css = `
				@media only screen {
					.container {}
				}
				.row {}
				.col {}
				#item {}
			`;
            const stylesheets = parseCssTexts([css]);
            const rules = getCSSRules(stylesheets);
            assert.strictEqual(rules.length, 4);
        });
    });

    suite("getCSSSelectors", () => {
        test("should return the correct amount of CSS selectors", () => {
            const css = `
				@media only screen {
					.container {}
				}
				.row {}
				.row .col {}
				.col {}
				#item {}
				form > div {}
			`;
            const stylesheets = parseCssTexts([css]);
            const rules = getCSSRules(stylesheets);
            const selectors = getCSSSelectors(rules);
            assert.strictEqual(selectors.length, 6);
        });
    });

    suite("sanitizeClassName", () => {
        test("should correctly remove closing parenthesis from class names", () => {
            const className = "container)";
            const sanitizedName = sanitizeClassName(className);
            assert.strictEqual(sanitizedName, "container");
        });
    });
});
