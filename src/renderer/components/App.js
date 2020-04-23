import React, { Component } from "react";
import p from "path";
import * as fs from "fs";

import FileTree from "./FileTree";
import Header from "./Header";
import TabManager from "./TabManager";
import Editor from "./Editor";
import { isFile } from "./utils";

class App extends Component {
  state = {
    directory: "C:\\Dev\\AutoCam\\temp\\Camera",
    files: [],

    // TabManager
    activeKey: "",
    panes: {},
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

  // TabManager

  changePane = (activeKey) => {
    console.log("App -> ChangePane -> activeKey", activeKey);
    this.setState({ activeKey });
    console.log("App -> ChangePane -> state", this.state);
  };

  addPane = (activeKey, title, content) => {
    const { panes } = this.state;
    panes[activeKey] = { title, content };
    this.setState({ panes, activeKey });
  };

  updatePane = (targetKey, content) => {
    const { panes } = this.state;
    panes[targetKey][content] = content;
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

    const openFile = this.state.openFile;
    return (
      <>
        <Header setDirectory={this.setDirectory}></Header>
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
