import Convert from "ansi-to-html";
import spawn from "cross-spawn";
import { notification } from "antd";

import { getTCPaths } from "./file";

let $ = (selector) => document.querySelector(selector);
const convertANSI = new Convert();

function streamLog(files) {
  let HTML = "";
  let combinations = false;
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

  // if combinations

  const child = spawn("npm", ["-v"]);
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");

  const updateLog = (data) => {
    console.log("updateLog -> data", data);
    HTML = convertANSI.toHtml(data);
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

export default streamLog;
