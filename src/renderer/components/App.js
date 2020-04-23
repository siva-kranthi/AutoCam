import React, { Component } from "react";
import p from "path";
import * as fs from "fs";
import { remote } from "electron";
import { HotKeys, GlobalHotKeys, configure } from "react-hotkeys";

import FileTree from "./FileTree";
import Header from "./Header";
import TabManager from "./TabManager";
import { isFile } from "./utils";

const dialog = remote.dialog;

configure({
  ignoreTags: [],
});

class App extends Component {
  state = {
    // Icons
    directory: "C:\\Dev\\AutoCam\\temp\\Camera",

    // FileTree
    files: [],

    // TabManager
    activeKey: "",
    panes: {}, // TODO: Without maintaing the file content. it is blinking in long files while editing
  };

  // Header

  setDirectory = (directory) => {
    this.setState({ directory });
  };

  // FileTree

  onFilesSelect = (files) => {
    this.setState({ files });
    console.log("App -> onFilesSelect -> files", files);

    if (files.length == 1) {
      let file = files[0];
      if (isFile(file)) {
        fs.readFile(file, "utf8", (err, content) => {
          if (err) throw err;
          const name = p.basename(file);
          this.addPane(file, name, content);
        });
      }
    }
  };

  // Editor

  saveFile = () => {
    const { activeKey, panes } = this.state;
    if ("unSaved" in panes[activeKey]) {
      fs.writeFile(activeKey, panes[activeKey].content, (err) => {
        if (err) throw err;
        delete panes[activeKey].unSaved;
        console.log("App -> saveFile -> panes", panes);
        this.setState({ panes });
      });
    }
  };

  // TabManager

  changePane = (activeKey) => {
    console.log("App -> ChangePane -> activeKey", activeKey);
    this.setState({ activeKey });
    console.log("App -> ChangePane -> state", this.state);
  };

  addPane = (activeKey, title, content) => {
    const { panes } = this.state;
    if (!(activeKey in panes)) panes[activeKey] = { title, content };
    this.setState({ panes, activeKey });
  };

  updatePane = (targetKey, content) => {
    console.log("App -> updatePane -> targetKey, content", targetKey, content);
    const { panes } = this.state;
    panes[targetKey].content = content;
    panes[targetKey].unSaved = true;
    this.setState({ panes });
  };

  editPane = (targetKey, action) => {
    console.log("App -> editPane -> action", action);
    console.log("App -> editPane -> targetKey", targetKey);

    if (action === "remove") this.removePane(targetKey);
  };

  removePane = (targetKey) => {
    let { activeKey, panes } = this.state;
    const paneKeys = Object.keys(panes);
    let targetIndex;

    // Saving file
    if ("unSaved" in panes[targetKey]) {
      const options = {
        title: "AutoCam",
        message: `Do you want to Save the Changes yo made to ${panes[targetKey].title}?`,
        detail: `Your changes will be lost if you don't save them`,
        type: "warning",
        buttons: ["Cancel", "Don't Save", "Save"],
        defaultId: 2,
        noLink: true,
      };
      const response = dialog.showMessageBoxSync(options);
      console.log("App -> removePane -> response", response);

      if (response == 2) {
        fs.writeFile(targetKey, panes[targetKey].content, (err) => {
          if (err) throw err;
        });
      } else if (response == 0) {
        return false;
      }
    }

    paneKeys.forEach((paneKey, i) => {
      if (paneKey === targetKey) {
        targetIndex = i;
      }
    });

    delete panes[targetKey];

    if (paneKeys.length && activeKey === targetKey) {
      if (targetIndex == paneKeys.length - 1) {
        activeKey = paneKeys[targetIndex - 1];
      } else {
        activeKey = paneKeys[targetIndex + 1];
      }
    }
    this.setState({ panes, activeKey });
  };

  render() {
    console.log("App Render");

    const handlers = { saveFile: this.saveFile };
    const keyMap = {
      saveFile: "ctrl+s",
    };

    return (
      <>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
        <Header
          setDirectory={this.setDirectory}
          saveFile={this.saveFile}
        ></Header>
        <main className="Body">
          <FileTree
            directory={this.state.directory}
            onFilesSelect={this.onFilesSelect}
          />
          <section className="Content">
            {Object.keys(this.state.panes).length > 0 && (
              <TabManager
                activeKey={this.state.activeKey}
                panes={this.state.panes}
                changePane={this.changePane}
                updatePane={this.updatePane}
                editPane={this.editPane}
              />
            )}
          </section>
        </main>
      </>
    );
  }
}

export default App;
