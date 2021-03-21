import {
    CompletionItemProvider,
    TextDocument,
    Position,
    CancellationToken,
    Range,
    CompletionItem,
    CompletionItemKind,
} from "vscode";
import aggregator from "./aggregator";

export class CompletionClassProvider implements CompletionItemProvider {
    private completionItems: PromiseLike<string[]>;

    constructor() {
        // initialize the completion classes
        this.completionItems = aggregator().then((x) => x);
    }

    public async provideCompletionItems(
        document: TextDocument,
        position: Position,
        token: CancellationToken
    ) {
        const start: Position = new Position(position.line, 0);
        const range: Range = new Range(start, position);
        const text: string = document.getText(range);

        // Check if the cursor is on a class attribute and retrieve all the css rules in this class attribute
        const rawClasses: RegExpMatchArray | null = text.match(/className=["|']([\w- ]*$)/);

        // the first match is always the className, we want to start suggesting when the
        // user starts typing a class name
        if (!rawClasses || rawClasses.length === 1) {
            return [];
        }

        // Creates the CompletionItems
        const classNames = await this.completionItems;

        // Stores the classes found on the class attribute
        const classesEntered = rawClasses[1].split(" ");

        // Removes classNames that have already been entered so that no suggestion is a duplicate
        classNames.filter((className) => !classesEntered.includes(className));

        const completionItems = classNames.map((definition) => {
            return new CompletionItem(definition, CompletionItemKind.Variable);
        });

        return completionItems;
    }
}
