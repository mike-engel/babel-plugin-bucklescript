import { dirname, join, relative, resolve } from "path";
import debugConstructor from "debug";
import { execFileSync, spawn } from "child_process";
import { StringLiteral } from "babel-types";

const debug = debugConstructor("babel-plugin-bucklescript");
const watching =
  process.argv.indexOf("-w") + process.argv.indexOf("--watch") >= -1;
const globalPath = process.cwd();
const compileDir = "lib";
const fileRegex = /\.(re|ml)$/;

let bsb;

/* istanbul ignore next */
try {
  bsb = require.resolve("bs-platform/bin/bsb.exe");
} catch (_) {
  bsb = "bsb";
}

/* istanbul ignore next */
debug(`Spawning bsb ${watching ? "watch " : "make world"}process`);

/* istanbul ignore next */
const watcher = spawn(bsb, [watching ? "-w -make-world" : "-make-world"]);

/* istanbul ignore next */
process.on("exit", () => {
  if (watching) {
    debug("Terminating bsb process");
    watcher.kill();
  }
});

export const isBuckleScriptFile = path => {
  debug(`Checking if the file is a bs file: " ${path}"`);
  return fileRegex.test(path);
};

export const traverseExpression = (t, arg) => {
  debug("Traversing the AST expression");
  if (t.isStringLiteral(arg)) {
    debug("AST expression is a string");
    return arg;
  }

  return null;
};

export const getModuleType = state => {
  debug("Checking configured module type");
  return state.opts.module || "js";
};

export const getNewPath = (path, state) => {
  debug("Generating new path");
  const sourcePath = dirname(state.file.opts.filenameRelative);
  const requirePath = resolve(sourcePath, path);
  const rootPath = requirePath.replace(globalPath, "");
  const newPath = join(globalPath, compileDir, getModuleType(state), rootPath);

  return newPath.replace(fileRegex, ".js");
};

export default babel => {
  return {
    visitor: {
      CallExpression(path, state) {
        debug("Evaluating call expression");

        if (path.node.callee.name !== "require") return;

        debug("Call expression is a require call");

        const args = path.node.arguments;

        /* istanbul ignore next */
        if (!args.length) return;

        debug("Call expression has at least one argument");

        const firstArg = traverseExpression(babel.types, args[0]);

        /* istanbul ignore next */
        if (!firstArg) return;

        debug("Call expression has a valid first argument");

        if (!isBuckleScriptFile(firstArg.value)) return;

        debug("Path is a bucklescript file");

        const newPath = getNewPath(firstArg.value, state);

        debug(`Setting new path: "${newPath}"`);

        path.replaceWith(
          babel.types.callExpression(path.node.callee, [
            babel.types.stringLiteral(newPath)
          ])
        );
      },
      ImportDeclaration(path, state) {
        debug("Evaluating import declaration");

        if (!isBuckleScriptFile(path.node.source.value)) return;

        debug("Path is a bucklescript file");

        const newPath = getNewPath(path.node.source.value, state);

        debug(`Setting new path: "${newPath}"`);

        path.replaceWith(
          babel.types.importDeclaration(
            path.node.specifiers,
            babel.types.stringLiteral(newPath)
          )
        );
      }
    }
  };
};
