const babel = require("babel-core");
const {
  default: plugin,
  isBuckleScriptFile,
  getModuleType,
  getNewPath,
  traverseExpression
} = require("..");
const { isAbsolute } = require("path");

const exampleFile = `
import test from "./test.re";
const yolo = require("./components/yolo.re")
import ignore from "./ignore.js";
const ignoreRequire = require("./components/ignore.js");

console.log();
console.log("test");
console.log({});
`;

const typesStub = {
  isStringLiteral: val => typeof val === "string"
};

const createSourceFile = filename => {
  return { file: { opts: { filenameRelative: filename } }, opts: {} };
};

it("compiles ok", () => {
  const { code } = babel.transform(exampleFile, { plugins: [plugin] });
  expect(code).toMatchSnapshot();
});

it("should contain the correct paths", () => {
  const { ast } = babel.transform(exampleFile, { plugins: [plugin] });
  const program = ast.program;
  const body = program.body;
  const importPath = body[0].source.value;
  const requirePath = body[1].declarations[0].init.arguments[0].value;

  expect(/\.js$/.test(importPath)).toBeTruthy;
  expect(/\.js$/.test(requirePath)).toBeTruthy;
  expect(isAbsolute(importPath)).toBeTruthy;
  expect(isAbsolute(requirePath)).toBeTruthy;
  expect(importPath.includes("/lib/js/test.js")).toBeTruthy;
  expect(requirePath.includes("/lib/js/components/yolo.js")).toBeTruthy;
});

it("should not alter any other source code", () => {
  const { ast } = babel.transform(exampleFile, { plugins: [plugin] });
  const program = ast.program;
  const body = program.body;
  const ignoredImportPath = body[2].source.value;
  const ignoredRequirePath = body[3].declarations[0].init.arguments[0].value;
  const emptyLog = body[4];
  const stringLog = body[5];
  const objectLog = body[6];

  expect(ignoredImportPath).toEqual("./ignore.js");
  expect(ignoredRequirePath).toEqual("./components/ignore.js");
  expect(emptyLog.expression.arguments).toHaveLength(0);
  expect(stringLog.expression.arguments[0].value).toEqual("test");
  expect(objectLog.expression.arguments[0].type).toEqual("ObjectExpression");
});

it(`should correctly check if it's a compileable file`, () => {
  expect(isBuckleScriptFile("test.js")).toBeFalsy;
  expect(isBuckleScriptFile("test.css")).toBeFalsy;
  expect(isBuckleScriptFile("test.re")).toBeTruthy;
  expect(isBuckleScriptFile("test.ml")).toBeTruthy;
});

it("should get the module type or pvide a default", () => {
  expect(getModuleType({ opts: {} })).toEqual("js");
  expect(getModuleType({ opts: { module: "es6" } })).toEqual("es6");
});

it("should return a new path for the file", () => {
  const newPath = getNewPath("./test.re", createSourceFile("src/index.js"));

  expect(newPath).toContain("/lib/js/src/test.js");
  expect(isAbsolute(newPath)).toBeTruthy;
});

it("should correctly traverse the path", () => {
  expect(traverseExpression(typesStub, "test")).toBeTruthy;
  expect(traverseExpression(typesStub, {})).toBeFalsy;
});
