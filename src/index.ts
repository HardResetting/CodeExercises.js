import EditableField from "./EditableField";
import { HtmlExcercise } from "./HTML/HtmlExcercise";
import { MonacoEditor, supportedLanguage } from "./MonacoEditor";

const constrainedInstances: Array<typeof ConstrainedEditor> = [];
const restrictions: Array<RangeRestriction> = [];

const content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
        .style-me {
            /* here */
        }
    </style>
</head>
<body>
    <div>
        Style me! 
        <br />
        background-color: red;
    </div>
</body>
</html>    
`;

const htmlExcercise: HtmlExcercise | null = null;

export function test() {
    const element = document.getElementById("container");
    if (element == null) {
        throw "no element";
    }

    create(element, content, "html");
}

export function create(element?: HTMLElement, content?: string, language?: supportedLanguage): HtmlExcercise {
    if (element == null) {
        throw "no element";
    }

    const htmlExcercise = new HtmlExcercise(element, content);

    htmlExcercise.addValidationRule
        .required()
        .iframeContains(".style-me", "no '.Style-me'-element!")
        .stringIncludes("here")
        .lambda(val => {
            return Math.random() > 0.5;
        }, "Random");


    const styleField = new EditableField([11, 1, 11, 23], true);
    styleField.addValidationRule
        .required()
        .endsWith("*/", "Need Multiline comment!");

    const divField = new EditableField([16, 9, 16, 9]);
    divField.addValidationRule
        .required();

    htmlExcercise.setEditableFields([styleField, divField]);

    htmlExcercise.onValidate.on(console.log);

    return htmlExcercise;
};