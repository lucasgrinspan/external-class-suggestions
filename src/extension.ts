import { languages, ExtensionContext } from "vscode";
import { CompletionClassProvider } from "./suggestionsProvider";

export function activate(context: ExtensionContext) {
    const provider = new CompletionClassProvider();

    context.subscriptions.push(languages.registerCompletionItemProvider("javascript", provider));
    context.subscriptions.push(
        languages.registerCompletionItemProvider("javascriptreact", provider)
    );
    context.subscriptions.push(
        languages.registerCompletionItemProvider("typescriptreact", provider)
    );
}

export function deactivate() {}
