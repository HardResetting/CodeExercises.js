/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   create: () => (/* binding */ create),\n/* harmony export */   test: () => (/* binding */ test)\n/* harmony export */ });\nvar constrainedInstances = [];\nvar restrictions = [];\nvar content = \"\\n<!DOCTYPE html>\\n<html lang=\\\"en\\\">\\n<head>\\n    <meta charset=\\\"UTF-8\\\">\\n    <meta name=\\\"viewport\\\" content=\\\"width=device-width, initial-scale=1.0\\\">\\n    <title>Document</title>\\n\\n    <style>\\n        .style-me {\\n            /* here */\\n        }\\n    </style>\\n</head>\\n<body>\\n    <div class=\\\"style-me\\\">\\n        Style me! \\n        <br />\\n        background-color: red;\\n    </div>\\n</body>\\n</html>    \\n\";\nfunction test() {\n    var element = document.getElementById(\"container\");\n    if (element == null) {\n        throw \"no element\";\n    }\n    create(element, content, \"html\");\n}\nfunction create(element, content, language) {\n    if (element == null) {\n        throw \"no element\";\n    }\n    var range = {\n        range: [11, 1, 11, 23], // Range of Function definition\n        allowMultiline: true,\n        label: \"styleText\"\n    };\n    restrictions.push(range);\n    var constrainedInstance = null;\n    var editorInstance = monaco.editor.create(element, {\n        value: content,\n        language: language\n    });\n    constrainedInstance = constrainedEditor(monaco);\n    var model = editorInstance.getModel();\n    if (model == null) {\n        throw \"missing moddel\";\n    }\n    constrainedInstance.initializeIn(editorInstance);\n    changeRanges();\n    model.onDidChangeContent(function () {\n        /**\n         * This settimeout is added this example purpose, but this may be a better practice\n         * As Restricted Editor also hooks the onDidChangeContent callback,\n         * if we add settimeout, it will make sure the values modifications\n         * done by the restricted editor are finished\n         */\n        // constrainedEditor(monaco) adds this method to the model. I don\"t know how I can tell TypeScript that.\n        content = model.getValue();\n        if (restrictions.length > 0) {\n            var values = model.getValueInEditableRanges();\n            console.log(\"change:editable-ranges\", values);\n        }\n    });\n    function changeRanges() {\n        if (restrictions.length < 1) {\n            return;\n        }\n        var model = editorInstance.getModel();\n        constrainedInstance.addRestrictionsTo(model, restrictions);\n    }\n}\n;\n\n\n//# sourceURL=webpack://codeexercises/./src/index.ts?");

/***/ })

/******/ });
/************************************************************************/
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module can't be inlined because the eval devtool is used.
/******/ var __webpack_exports__ = {};
/******/ __webpack_modules__["./src/index.ts"](0, __webpack_exports__, __webpack_require__);
/******/ var __webpack_exports__create = __webpack_exports__.create;
/******/ var __webpack_exports__test = __webpack_exports__.test;
/******/ export { __webpack_exports__create as create, __webpack_exports__test as test };
/******/ 
