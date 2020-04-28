import Convert from "ansi-to-html";
import spawn from "cross-spawn";

let $ = (selector) => document.querySelector(selector);
const convertANSI = new Convert();

function streamLog() {
  let HTML = "";
  const logObj = $("#log");

  const updateLog = (data) => {
    console.log("updateLog -> data", data);
    HTML = convertANSI.toHtml(data);
    logObj.insertAdjacentHTML("beforeend", HTML);
    logObj.scrollTop = logObj.scrollHeight - logObj.clientHeight; // To Scroll to the bottom
  };

  const child = spawn("yarn", ["dist"]);
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");

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
