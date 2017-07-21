import { dirname, join, relative, resolve } from "path";
import { execFileSync } from "child_process";
import { StringLiteral } from "babel-types";

const globalPath = process.cwd();
const compileDir = "lib";
const fileRegex = /\.(re|ml)$/;

let bsb;

try {
  bsb = require.resolve("bs-platform/bin/bsb.exe");
} catch (e) {
  bsb = "bsb";
}

const isBuckleScriptFile = path => {
  return fileRegex.test(path);
};

const traverseExpression = (t, arg) => {
  if (t.isStringLiteral(arg)) {
    return arg;
  }

  if (t.isBinaryExpression(arg)) {
    return traverseExpression(t, arg.left);
  }

  return null;
};

const getModuleType = state => {
  return state.opts.module || "js";
};

const getNewPath = (path, state) => {
  const sourcePath = dirname(state.file.opts.filenameRelative);
  const requirePath = resolve(sourcePath, path);
  const rootPath = requirePath.replace(globalPath, "");
  const newPath = join(globalPath, compileDir, getModuleType(state), rootPath);

  return newPath.replace(fileRegex, ".js");
};

const compile = () => {
  execFileSync(bsb, ["-make-world"], { stdio: "pipe" });
};

export default ({ types: t }) => {
  return {
    visitor: {
      CallExpression(path, state) {
        if (path.node.callee.name !== "require") return;

        const args = path.node.arguments;

        if (!args.length) return;

        const firstArg = traverseExpression(t, args[0]);

        if (!firstArg) return;

        if (!isBuckleScriptFile(firstArg.value)) return;

        const newPath = getNewPath(firstArg.value, state);

        compile();

        path.node.arguments = [newPath];
      },
      ImportDeclaration(path, state) {
        if (!isBuckleScriptFile(path.node.source.value)) return;

        const newPath = getNewPath(path.node.source.value, state);

        compile();

        path.node.source.value = newPath;
      }
    }
  };
};
