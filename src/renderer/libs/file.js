import React from "react";
import { readdirSync, statSync } from "fs";
import p from "path";
import glob from "glob";
// import { CameraOutlined, FolderFilled } from "@ant-design/icons";

const constants = {
  DIRECTORY: "directory",
  FILE: "file",
};

function safeReadDirSync(path) {
  let dirData = {};
  try {
    dirData = readdirSync(path);
  } catch (ex) {
    if (ex.code == "EACCES" || ex.code == "EPERM") {
      //User does not have permissions, ignore directory
      return null;
    } else throw ex;
  }
  return dirData;
}

/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param  {string} path
 * @return {string}
 */
function normalizePath(path) {
  return path.replace(/\\/g, "/");
}

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
function isRegExp(regExp) {
  return typeof regExp === "object" && regExp.constructor == RegExp;
}

/**
 * Collects the files and folders for a directory path into an Object, subject
 * to the options supplied, and invoking optional
 * @param  {String} path
 * @param  {Object} options
 * @param  {function} onEachFile
 * @param  {function} onEachDirectory
 * @return {Object}
 */
function directoryTree(path, options, result, onEachFile, onEachDirectory) {
  const name = p.basename(path);
  path = options && options.normalizePath ? normalizePath(path) : path;
  const item = { path, name };
  let stats;

  item.title = name;
  item.key = path;

  try {
    stats = statSync(path);
  } catch (e) {
    return null;
  }

  // Skip if it matches the exclude regex
  if (options && options.exclude) {
    const excludes = isRegExp(options.exclude)
      ? [options.exclude]
      : options.exclude;
    if (excludes.some((exclusion) => exclusion.test(path))) {
      return null;
    }
  }

  if (stats.isFile()) {
    const ext = p.extname(path).toLowerCase();

    // Skip if it does not match the extension regex
    if (options && options.extensions && !options.extensions.test(ext))
      return null;

    item.size = stats.size; // File size in bytes
    item.extension = ext;
    item.type = constants.FILE;

    switch (ext) {
      case ".tc":
        item.icon = <i className="nf nf-dev-techcrunch" />;
        break;
      default:
        item.icon = <i className="nf nf-fa-file_o" />;
    }

    if (result && name === "summary.json") {
      item.icon = <i className="nf nf-seti-image" />;
      item.title = "AutoCam Result";
    }

    if (options && options.attributes) {
      options.attributes.forEach((attribute) => {
        item[attribute] = stats[attribute];
      });
    }

    if (onEachFile) {
      onEachFile(item, path, stats);
    }
  } else if (stats.isDirectory()) {
    let dirData = safeReadDirSync(path);
    if (dirData === null) return null;

    if (options && options.attributes) {
      options.attributes.forEach((attribute) => {
        item[attribute] = stats[attribute];
      });
    }

    item.children = dirData
      .map((child) =>
        directoryTree(
          p.join(path, child),
          options,
          result,
          onEachFile,
          onEachDirectory
        )
      )
      .filter((e) => !!e);

    item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
    item.type = constants.DIRECTORY;
    item.icon = <i className="nf nf-custom-folder" />;

    if (onEachDirectory) {
      onEachDirectory(item, path, stats);
    }
  } else {
    return null; // Or set item.size = 0 for devices, FIFO and sockets ?
  }
  return item;
}

function isFile(path) {
  return !!p.extname(path);
}

function isTCFile(path) {
  return !!(p.extname(path) === ".tc");
}

function isExcelFile(path) {
  return !!(p.extname(path) === ".xls" || p.extname(path) === ".xlsx");
}

function isChildOf(child, parent) {
  if (child === parent) return true;

  const parentTokens = parent.split("/").filter((i) => i.length);
  const chilsTokens = child.split("/");

  return parentTokens.every((t, i) => chilsTokens[i] === t);
}

function getTCPaths(paths) {
  console.log("getTCPaths -> paths", paths);
  const globOptions = {
    absolute: true,
  };
  let TCPaths = [];
  let excelPaths = [];
  let dirPaths = [];
  let parentPaths = [];

  for (let path of paths) {
    console.log("getTCs -> TCPaths", TCPaths);

    path = path.replace(/\\/g, "/");
    console.log("getTCs -> path", path);

    if (isFile(path)) {
      if (isTCFile(path)) {
        TCPaths.push(path);
      } else if (isExcelFile(path)) {
        excelPaths.push(path);
      }
    }
    // Directory
    else {
      parentPaths = dirPaths.filter((dirPath) => isChildOf(path, dirPath));
      if (parentPaths.length) {
        console.warn(path, "already processed", parentPaths);
        break;
      }

      let files = glob.sync(path + "/**/*.tc", globOptions);
      console.log("getTCPaths -> files", files);
      TCPaths = [...TCPaths, ...files];
    }
  }

  console.log("getTCPaths -> TCPaths, excelPaths", TCPaths, excelPaths);

  if (TCPaths.length !== 0) return [...new Set(TCPaths)];

  if (excelPaths.length !== 0) return excelPaths[0];

  return [];
}

export { directoryTree, isFile, getTCPaths };
