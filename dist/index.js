"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNewPath = exports.getModuleType = exports.traverseExpression = exports.isBuckleScriptFile = undefined;

var _path = require("path");

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _child_process = require("child_process");

var _babelTypes = require("babel-types");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var debug = (0, _debug2.default)("babel-plugin-bucklescript");
var watching =
  process.argv.indexOf("-w") + process.argv.indexOf("--watch") >= -1;
var globalPath = process.cwd();
var compileDir = "lib";
var fileRegex = /\.(re|ml)$/;

var bsb = void 0;

try {
  bsb = require.resolve("bs-platform/lib/bsb.exe");
} catch (_) {
  /* istanbul ignore next */
  bsb = "bsb";
}

/* istanbul ignore next */
debug("Spawning bsb " + (watching ? "watch " : "make world") + "process");

/* istanbul ignore next */
var watcher = (0, _child_process.spawn)(
  bsb,
  watching ? ["-w", "-make-world"] : ["-make-world"]
);

/* istanbul ignore next */
process.on("exit", function() {
  if (watching) {
    /* istanbul ignore next */
    debug("Terminating bsb process");
    watcher.kill();
  }
});

var isBuckleScriptFile = (exports.isBuckleScriptFile = function isBuckleScriptFile(
  path
) {
  /* istanbul ignore next */
  debug('Checking if the file is a bs file: " ' + path + '"');
  return fileRegex.test(path);
});

var traverseExpression = (exports.traverseExpression = function traverseExpression(
  t,
  arg
) {
  /* istanbul ignore next */
  debug("Traversing the AST expression");
  if (t.isStringLiteral(arg)) {
    /* istanbul ignore next */
    debug("AST expression is a string");
    return arg;
  }

  return null;
});

var getModuleType = (exports.getModuleType = function getModuleType(state) {
  debug("Checking configured module type");
  return state.opts.module || "js";
});

var getNewPath = (exports.getNewPath = function getNewPath(path, state) {
  debug("Generating new path");
  var sourcePath = (0, _path.dirname)(state.file.opts.filenameRelative);
  var requirePath = (0, _path.resolve)(sourcePath, path);
  var rootPath = requirePath.replace(globalPath, "");
  var newPath = (0, _path.join)(
    globalPath,
    compileDir,
    getModuleType(state),
    rootPath
  );

  return newPath.replace(fileRegex, ".js");
});

exports.default = function(babel) {
  return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        debug("Evaluating call expression");

        if (path.node.callee.name !== "require") return;

        debug("Call expression is a require call");

        var args = path.node.arguments;

        /* istanbul ignore next */
        if (!args.length) return;

        debug("Call expression has at least one argument");

        var firstArg = traverseExpression(babel.types, args[0]);

        /* istanbul ignore next */
        if (!firstArg) return;

        debug("Call expression has a valid first argument");

        if (!isBuckleScriptFile(firstArg.value)) return;

        debug("Path is a bucklescript file");

        var newPath = getNewPath(firstArg.value, state);

        debug('Setting new path: "' + newPath + '"');

        path.replaceWith(
          babel.types.callExpression(path.node.callee, [
            babel.types.stringLiteral(newPath)
          ])
        );
      },
      ImportDeclaration: function ImportDeclaration(path, state) {
        debug("Evaluating import declaration");

        if (!isBuckleScriptFile(path.node.source.value)) return;

        debug("Path is a bucklescript file");

        var newPath = getNewPath(path.node.source.value, state);

        debug('Setting new path: "' + newPath + '"');

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
