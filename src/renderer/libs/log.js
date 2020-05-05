import Convert from "ansi-to-html";
import spawn from "cross-spawn";
import { notification } from "antd";
import p from "path";

import { getTCPaths } from "./file";

let $ = (selector) => document.querySelector(selector);
const convertANSI = new Convert();
const colors = {
  DEBUG: "#AAA",
  INFO: "#0A0",
  WARNI: "#A50",
  ERROR: "#A00",
  CRITI: "#A00",
};

function streamLog(files, settings) {
  let HTML = "";
  let combinations = false;
  let params = [];
  const SARTPath = p.join(__static, "/SART/SART.exe");
  const logObj = $("#log");
  const TCPaths = files.length !== 0 ? getTCPaths(files) : [];
  console.log("streamLog -> TCPaths", TCPaths);

  if (Array.isArray(TCPaths)) {
    if (TCPaths.length === 0) {
      notification.error({
        message: "Execution not Started",
        description: "Select at least one TC for execution",
      });
      return;
    }
  } else {
    combinations = true;
  }

  if (!combinations) {
    for (let [key, value] of Object.entries(settings.general)) {
      if (["iterations", "re_run", "loop"].includes(key)) value = Number(value);
      if (value) {
        if (typeof value === "boolean") params.push(`--${key}`);
        else params.push(`--${key}`, value);
      }
    }
    params.push(`--test_cases`);
    params = params.concat(TCPaths);
  } else {
    for (let [key, value] of Object.entries(settings.combination)) {
      if (value) {
        if (typeof value === "boolean") params.push(`--${key}`);
        else params.push(`--${key}`, value);
      }
    }
    params.push(`--combinations_path`, TCPaths);
  }
  console.log("streamLog -> params", params);

  const child = spawn("npm", ["-v"]);
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  logObj.insertAdjacentHTML(
    "beforeend",
    "<h2 class='divider line glow'>New Execution</h2>"
  );

  const updateLog = (data) => {
    console.log("updateLog -> data", data);
    // HTML = convertANSI.toHtml(data);
    HTML = colorize(data);
    logObj.insertAdjacentHTML("beforeend", HTML); // More optimized way than innerHTML
    logObj.scrollTop = logObj.scrollHeight - logObj.clientHeight; // To Scroll to the bottom
  };

  // Reading Stdout data
  child.stdout.on("data", updateLog);

  child.stdout.on("end", function (data) {
    console.log("Stream is ended. no more data from stdout");
    console.log("streamLog -> stdout data", data);
  });

  child.on("exit", function (code, signal) {
    // if (code != 0) {
    console.log("code, signal", code, signal);
    // }
  });

  child.on("error", function (err) {
    console.error("streamLog -> Child start err", err);
  });

  child.stderr.on("data", (data) => {
    console.error("streamLog -> stderr data", data);
  });
}

function colorize(log) {
  for (let [key, value] of Object.entries(log)) {
    if (log.includes(key)) {
      log = `<span style="color:${colors[key]}">${log}</span>`;
    }
  }
}

export default streamLog;
