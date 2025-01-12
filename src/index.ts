import { HtmlExcercise } from "./Excercise";
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
    <div class="style-me">
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

    const result = htmlExcercise.validationRuleSet
        .required()
        .iframeContains(".style-me", "no Style-me!")
        .stringIncludes("here")
        .lambda(val => {
            return false;
        }, "Error");

    return htmlExcercise;
};