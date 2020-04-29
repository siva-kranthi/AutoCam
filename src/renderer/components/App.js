import React, { Component } from "react";
import p from "path";
import fs from "fs";
import { remote } from "electron";
import { HotKeys, GlobalHotKeys, configure } from "react-hotkeys";
import Store from "electron-store";

import FileTree from "./FileTree";
import Header from "./Header";
import TabManager from "./TabManager";
import { isFile } from "../libs/file";
import streamLog from "../libs/log";

const dialog = remote.dialog;

configure({
  ignoreTags: [],
});

const defaults = {
  settings: {
    skip: false,
    record_video: false,
    iterations: "",
    re_run: "",
    loop: "",
    sheet: "",
  },
};

const store = new Store({ defaults });
console.log("store.path", store.path);

class App extends Component {
  state = {
    // Icons
    TCsDirectory: p.join(__static, "/SART/TestCases/Camera"),
    resultsDirectory: p.join(__static, "/SART/Results"),

    // FileTree
    files: [],

    // Settings
    settings: store.get("settings"),

    // TabManager
    activeKey: "",
    panes: {}, // TODO: Without maintaing the file content. it is blinking in long files while editing
  };

  // Header

  openSettings = () => {
    this.addPane("settings", "Settings");
  };

  runSART = () => {
    streamLog(this.state.files);
  };

  // FileTree

  showDialog = (title, buttonLabel) => {
    const options = {
      title: "Select Test Cases Folder",
      buttonLabel: "Select TCs Folder",
      properties: ["openDirectory"],
    };

    const dir = dialog.showOpenDialogSync(options);
    console.log("App -> showDialog -> dir", dir);
    return dir;
  };

  setResultsDirectory = () => {
    const title = "Select Results Folder";
    const buttonLabel = "Select Results Folder";
    const resultsDirectory = this.showDialog(title, buttonLabel);

    resultsDirectory &&
      this.setState({ resultsDirectory: resultsDirectory[0] });
  };

  setTCsDirectory = () => {
    const title = "Select Test Cases Folder";
    const buttonLabel = "Select TCs Folder";
    const TCsDirectory = this.showDialog(title, buttonLabel);

    TCsDirectory && this.setState({ TCsDirectory: TCsDirectory[0] });
  };

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

  // Settings

  onRVChange = (checked, e) => {
    const { settings } = this.state;
    settings.record_video = checked;
    store.set("settings.record_video", checked);
    this.setState({ settings });
  };

  onSkipChange = (checked, e) => {
    const { settings } = this.state;
    settings.skip = checked;
    store.set("settings.skip", checked);
    this.setState({ settings });
  };

  onSettingsInputChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    const { settings } = this.state;
    settings[id] = value;
    store.set(`settings.${id}`, value);
    this.setState({ settings });
  };

  // TabManager

  changePane = (activeKey) => {
    console.log("App -> ChangePane -> activeKey", activeKey);
    this.setState({ activeKey });
    console.log("App -> ChangePane -> state", this.state);
  };

  addPane = (activeKey, title, content = "") => {
    const { panes } = this.state;
    if (!(activeKey in panes)) panes[activeKey] = { title, content };
    this.setState({ panes, activeKey });
  };

  updatePane = (targetKey, content) => {
    console.log("App -> updatePane -> targetKey, content", targetKey, content);
    const { panes } = this.state;
    if (panes[targetKey].content !== content) {
      panes[targetKey].content = content;
      panes[targetKey].unSaved = true;
      this.setState({ panes });
    }
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
    console.log("App -> Render -> State", this.state);

    const handlers = { saveFile: this.saveFile };
    const keyMap = {
      saveFile: "ctrl+s",
    };

    return (
      <>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
        <Header
          saveFile={this.saveFile}
          openSettings={this.openSettings}
          runSART={this.runSART}
        ></Header>
        <main className="Body">
          <nav className="FileTreeContainer">
            <FileTree
              directory={this.state.TCsDirectory}
              onSelect={this.onFilesSelect}
              title="TEST CASES EXPLORER"
              multiple={true}
              onClick={this.setTCsDirectory}
            />
            <FileTree
              directory={this.state.resultsDirectory}
              onSelect={this.onFilesSelect}
              title="RESULTS EXPLORER"
              multiple={false}
              onClick={this.setResultsDirectory}
            />
          </nav>
          <section className="Content">
            <div className="Tabs">
              {Object.keys(this.state.panes).length > 0 && (
                <TabManager
                  activeKey={this.state.activeKey}
                  panes={this.state.panes}
                  changePane={this.changePane}
                  updatePane={this.updatePane}
                  editPane={this.editPane}
                  settings={this.state.settings}
                  onRVChange={this.onRVChange}
                  onSettingsInputChange={this.onSettingsInputChange}
                  onSkipChange={this.onSkipChange}
                />
              )}
            </div>
            <div className="Log">
              <header className="Title">
                <span className="ant-typography">
                  <strong>Log</strong>
                </span>
              </header>
              <pre id="log">
                {/* {`$ yarn compile &amp;&amp; electron-builder
$ electron-webpack
Hash: 88b9e3ca5597290e0babe6f51d0c80dace4fd25bcdcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
Version: webpack 4.42.1
Child
    Hash: 88b9e3ca5597290e0bab
    Time: 2593ms
    Built at: 26/04/2020 8:16:21 pm
          Asset      Size  Chunks                   Chunk Names
        main.js  2.26 KiB       0  [emitted]        main
    main.js.map  2.78 KiB       0  [emitted] [dev]  main
    Entrypoint main = main.js main.js.map
    [0] external "electron" 42 bytes {0} [built]
    [1] external "path" 42 bytes {0} [built]
    [2] external "url" 42 bytes {0} [built]
    [3] multi ./src/main/index.js 28 bytes {0} [built]
    [4] ./src/main/index.js 2.62 KiB {0} [built]
Child
    Hash: e6f51d0c80dace4fd25b
    Time: 7173ms
    Built at: 26/04/2020 8:16:26 pm
                                                             Asset       Size  Chunks                   Chunk Names
               fonts/Symbols-2048-em Nerd Font Complete--fonts.ttf    826 KiB          [emitted]        
                                                        index.html  306 bytes          [emitted]        
                                                       renderer.js    595 KiB       0  [emitted]        renderer
                                           renderer.js.LICENSE.txt   1.13 KiB          [emitted]        
                                                   renderer.js.map    731 KiB       0  [emitted] [dev]  renderer
        static/vs/base/browser/ui/codiconLabel/codicon/codicon.ttf   55.2 KiB          [emitted]        
                               static/vs/base/worker/workerMain.js    166 KiB          [emitted]        
                            static/vs/basic-languages/abap/abap.js   5.55 KiB          [emitted]        
                            static/vs/basic-languages/apex/apex.js   4.25 KiB          [emitted]        
                          static/vs/basic-languages/azcli/azcli.js   1.21 KiB          [emitted]        
                              static/vs/basic-languages/bat/bat.js   2.18 KiB          [emitted]        
                    static/vs/basic-languages/cameligo/cameligo.js   2.37 KiB          [emitted]        
                      static/vs/basic-languages/clojure/clojure.js    9.8 KiB          [emitted]        
                        static/vs/basic-languages/coffee/coffee.js   3.89 KiB          [emitted]        
                              static/vs/basic-languages/cpp/cpp.js   5.38 KiB          [emitted]        
                        static/vs/basic-languages/csharp/csharp.js   4.81 KiB          [emitted]        
                              static/vs/basic-languages/csp/csp.js   1.76 KiB          [emitted]        
                              static/vs/basic-languages/css/css.js   4.76 KiB          [emitted]        
                static/vs/basic-languages/dockerfile/dockerfile.js   2.18 KiB          [emitted]        
                        static/vs/basic-languages/fsharp/fsharp.js   3.29 KiB          [emitted]        
                                static/vs/basic-languages/go/go.js   2.97 KiB          [emitted]        
                      static/vs/basic-languages/graphql/graphql.js   2.59 KiB          [emitted]        
                static/vs/basic-languages/handlebars/handlebars.js   6.41 KiB          [emitted]        
                            static/vs/basic-languages/html/html.js   4.82 KiB          [emitted]        
                              static/vs/basic-languages/ini/ini.js   1.45 KiB          [emitted]        
                            static/vs/basic-languages/java/java.js   3.28 KiB          [emitted]        
                static/vs/basic-languages/javascript/javascript.js   6.32 KiB          [emitted]        
                        static/vs/basic-languages/kotlin/kotlin.js   3.74 KiB          [emitted]        
                            static/vs/basic-languages/less/less.js   4.18 KiB          [emitted]        
                              static/vs/basic-languages/lua/lua.js   2.45 KiB          [emitted]        
                    static/vs/basic-languages/markdown/markdown.js   4.09 KiB          [emitted]        
                            static/vs/basic-languages/mips/mips.js   2.89 KiB          [emitted]        
                          static/vs/basic-languages/msdax/msdax.js   5.17 KiB          [emitted]        
                          static/vs/basic-languages/mysql/mysql.js   14.5 KiB          [emitted]        
              static/vs/basic-languages/objective-c/objective-c.js   2.74 KiB          [emitted]        
                        static/vs/basic-languages/pascal/pascal.js    3.3 KiB          [emitted]        
                  static/vs/basic-languages/pascaligo/pascaligo.js   2.34 KiB          [emitted]        
                            static/vs/basic-languages/perl/perl.js   8.44 KiB          [emitted]        
                          static/vs/basic-languages/pgsql/pgsql.js   17.6 KiB          [emitted]        
                              static/vs/basic-languages/php/php.js   8.21 KiB          [emitted]        
                    static/vs/basic-languages/postiats/postiats.js   8.06 KiB          [emitted]        
                static/vs/basic-languages/powerquery/powerquery.js   16.9 KiB          [emitted]        
                static/vs/basic-languages/powershell/powershell.js   3.58 KiB          [emitted]        
                              static/vs/basic-languages/pug/pug.js   5.09 KiB          [emitted]        
                        static/vs/basic-languages/python/python.js   3.55 KiB          [emitted]        
                                  static/vs/basic-languages/r/r.js   3.14 KiB          [emitted]        
                          static/vs/basic-languages/razor/razor.js   8.63 KiB          [emitted]        
                          static/vs/basic-languages/redis/redis.js   3.85 KiB          [emitted]        
                    static/vs/basic-languages/redshift/redshift.js   11.9 KiB          [emitted]        
    static/vs/basic-languages/restructuredtext/restructuredtext.js   4.26 KiB          [emitted]        
                            static/vs/basic-languages/ruby/ruby.js   8.68 KiB          [emitted]        
                            static/vs/basic-languages/rust/rust.js   4.21 KiB          [emitted]        
                                static/vs/basic-languages/sb/sb.js   2.16 KiB          [emitted]        
                        static/vs/basic-languages/scheme/scheme.js   2.11 KiB          [emitted]        
                            static/vs/basic-languages/scss/scss.js   6.63 KiB          [emitted]        
                          static/vs/basic-languages/shell/shell.js   3.24 KiB          [emitted]        
                    static/vs/basic-languages/solidity/solidity.js   18.5 KiB          [emitted]        
                        static/vs/basic-languages/sophia/sophia.js   3.08 KiB          [emitted]        
                              static/vs/basic-languages/sql/sql.js   18.2 KiB          [emitted]        
                                static/vs/basic-languages/st/st.js   7.58 KiB          [emitted]        
                          static/vs/basic-languages/swift/swift.js    4.6 KiB          [emitted]        
                              static/vs/basic-languages/tcl/tcl.js   3.86 KiB          [emitted]        
                            static/vs/basic-languages/twig/twig.js   6.21 KiB          [emitted]        
                static/vs/basic-languages/typescript/typescript.js   5.34 KiB          [emitted]        
                                static/vs/basic-languages/vb/vb.js   6.05 KiB          [emitted]        
                              static/vs/basic-languages/xml/xml.js   2.07 KiB          [emitted]        
                            static/vs/basic-languages/yaml/yaml.js   3.83 KiB          [emitted]        
                                  static/vs/editor/editor.main.css   88.9 KiB          [emitted]        
                                   static/vs/editor/editor.main.js   2.24 MiB          [emitted]        
                            static/vs/editor/editor.main.nls.de.js   55.9 KiB          [emitted]        
                            static/vs/editor/editor.main.nls.es.js     57 KiB          [emitted]        
                            static/vs/editor/editor.main.nls.fr.js     60 KiB          [emitted]        
                            static/vs/editor/editor.main.nls.it.js   59.3 KiB          [emitted]        
                            static/vs/editor/editor.main.nls.ja.js   64.2 KiB          [emitted]        
                               static/vs/editor/editor.main.nls.js   46.8 KiB          [emitted]        
                            static/vs/editor/editor.main.nls.ko.js   56.3 KiB          [emitted]        
                            static/vs/editor/editor.main.nls.ru.js   93.6 KiB          [emitted]        
                         static/vs/editor/editor.main.nls.zh-cn.js   42.9 KiB          [emitted]        
                         static/vs/editor/editor.main.nls.zh-tw.js   43.8 KiB          [emitted]        
                                 static/vs/language/css/cssMode.js    727 KiB          [emitted]        
                               static/vs/language/css/cssWorker.js    718 KiB          [emitted]        
                               static/vs/language/html/htmlMode.js    436 KiB          [emitted]        
                             static/vs/language/html/htmlWorker.js    425 KiB          [emitted]        
                               static/vs/language/json/jsonMode.js    141 KiB          [emitted]        
                             static/vs/language/json/jsonWorker.js    129 KiB          [emitted]        
                           static/vs/language/typescript/tsMode.js   23.9 KiB          [emitted]        
                         static/vs/language/typescript/tsWorker.js   3.33 MiB          [emitted]        
                                               static/vs/loader.js   29.5 KiB          [emitted]        
                                                        styles.css    920 KiB       0  [emitted]        renderer
                                                    styles.css.map    193 KiB       0  [emitted] [dev]  renderer
    Entrypoint renderer = styles.css renderer.js styles.css.map renderer.js.map
      [8] external "path" 42 bytes {0} [built]
     [13] external "fs" 42 bytes {0} [built]
     [31] external "electron" 42 bytes {0} [built]
     [54] external "react-hotkeys" 42 bytes {0} [built]
     [96] external "ansi-to-html" 42 bytes {0} [built]
     [97] external "cross-spawn" 42 bytes {0} [built]
    [102] multi ./src/renderer/index.js 28 bytes {0} [built]
    [231] ./src/renderer/assets/css/nerd-fonts-generated.css 39 bytes {0} [built]
    [232] ./src/renderer/assets/css/main.css 39 bytes {0} [built]
    [233] ./src/renderer/index.js + 165 modules 707 KiB {0} [built]
          | ./src/renderer/index.js 562 bytes [built]
          | ./src/renderer/libs/utils.js 47 bytes [built]
          | ./src/renderer/libs/file.js 3.48 KiB [built]
          | ./src/renderer/libs/log.js 1.13 KiB [built]
          |     + 162 hidden modules
        + 1797 hidden modules
    Child HtmlWebpackCompiler:
         1 asset
        Entrypoint HtmlWebpackPlugin_0 = __child-HtmlWebpackPlugin_0
        [0] ./node_modules/html-loader/dist/cjs.js?minimize=false!./dist/.renderer-index-template.html 302 bytes {0} [built]
    Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js??ref--6-1!node_modules/antd/dist/antd.dark.css:
        Entrypoint mini-css-extract-plugin = *
           2 modules
    Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js??ref--6-1!src/renderer/assets/css/main.css:
        Entrypoint mini-css-extract-plugin = *
        [1] ./node_modules/css-loader/dist/cjs.js??ref--6-1!./src/renderer/assets/css/main.css 3.44 KiB {0} [built]
        [2] ./node_modules/css-loader/dist/cjs.js??ref--6-1!./src/renderer/assets/css/antOW.css 1.26 KiB {0} [built]
            + 1 hidden module
    Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js??ref--6-1!src/renderer/assets/css/nerd-fonts-generated.css:
        Entrypoint mini-css-extract-plugin = *
        [0] ./node_modules/css-loader/dist/cjs.js??ref--6-1!./src/renderer/assets/css/nerd-fonts-generated.css 214 KiB {0} [built]
        [3] ./src/renderer/assets/css/fonts/Symbols-2048-em Nerd Font Complete.ttf 95 bytes {0} [built]
            + 2 hidden modules
  • electron-builder  version=22.4.1 os=10.0.18362
  • loaded parent configuration  file=C:\Dev\AutoCam\node_modules\electron-webpack\out\electron-builder.js
  • description is missed in the package.json  appPackageFile=C:\Dev\AutoCam\package.json
  • author is missed in the package.json  appPackageFile=C:\Dev\AutoCam\package.json
  • packaging       platform=win32 arch=x64 electron=8.2.0 appOutDir=dist\win-unpacked
  • default Electron icon is used  reason=application icon is not set
  • building        target=nsis file=dist\AutoCam Setup 1.0.0.exe archs=x64 oneClick=true perMachine=false
  • building block map  blockMapFile=dist\AutoCam Setup 1.0.0.exe.blockmap`} */}
              </pre>
            </div>
          </section>
        </main>
      </>
    );
  }
}

export default App;
