"use strict";

import { app, BrowserWindow } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";

if (module.hot) {
  module.hot.accept();
}

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  // const splashWindow = new BrowserWindow({
  //   width: 550,
  //   height: 350,
  //   backgroundColor: "#1e2124",
  //   center: true,
  //   frame: false,
  //   resizable: false,
  //   show: false,
  // });

  // splashWindow.loadFile(path.join(__static, "/splash.html"));

  // splashWindow.once("ready-to-show", () => {
  //   splashWindow.show();
  // });

  const window = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 830,
    minHeight: 430,
    backgroundColor: "#2a2522",
    // show: false,
    titleBarStyle: "hidden",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    icon: path.join(__static, "/logo.png"),
    title: "AutoCam - E2E Camera Automation",
  });

  // // if main window is ready to show, then destroy the splash window and show up the main window
  // window.once("ready-to-show", () => {
  //   splashWindow.destroy();
  //   window.show();
  // });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
  mainWindow = createMainWindow();
});

function splashWindow() {
  const splashWindow = new BrowserWindow({
    width: 550,
    height: 350,
    backgroundColor: "#1e2124",
    center: true,
    frame: false,
    resizable: false,
    show: false,
  });
}
