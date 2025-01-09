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


export function test() {
    const element = document.getElementById("container");
    if (element == null) {
        throw "no element";
    }

    create(element, content, "html");
}

export function create(element?: HTMLElement, content?: string, language?: string) {
    if (element == null) {
        throw "no element";
    }

    const range = {
        range: [11, 1, 11, 23], // Range of Function definition
        allowMultiline: true,
        label: "styleText"
    } as RangeRestriction;

    restrictions.push(range);

    let constrainedInstance: ConstrainedEditor | null = null;

    const editorInstance = monaco.editor.create(element, {
        value: content,
        language: language
    });

    constrainedInstance = constrainedEditor(monaco);

    const model = editorInstance.getModel();
    if (model == null) {
        throw "missing moddel";
    }

    constrainedInstance.initializeIn(editorInstance);
    changeRanges();

    model.onDidChangeContent(function () {
        /**
         * This settimeout is added this example purpose, but this may be a better practice
         * As Restricted Editor also hooks the onDidChangeContent callback,
         * if we add settimeout, it will make sure the values modifications
         * done by the restricted editor are finished
         */

        // constrainedEditor(monaco) adds this method to the model. I don"t know how I can tell TypeScript that.
        content = model.getValue();

        if (restrictions.length > 0) {
            const values = (model as unknown as ExtendedModel).getValueInEditableRanges();
            console.log("change:editable-ranges", values);
        }


    });

    function changeRanges(): void {
        if (restrictions.length < 1) {
            return;
        }

        const model = editorInstance!.getModel();
        constrainedInstance!.addRestrictionsTo(model!, restrictions);
    }
};