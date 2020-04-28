import React, { PureComponent } from "react";
import * as path from "path";

delete window.require;
delete window.exports;
delete window.module;

import MonacoEditor, { ControlledEditor, monaco } from "@monaco-editor/react";

class Editor extends PureComponent {
  // After adding check onDidChangeModelContent is firing even after switchig the tabs. Fixed the issue by Adding content chec in the App component
  shouldComponentUpdate(nextProps) {
    if (nextProps.activeKey == this.props.activeKey) return false;
    return true;
  }

  editorDidMount = (getValue, editor) => {
    editor.focus();
    editor.onDidChangeModelContent((ev) => {
      const newValue = editor.getValue();
      console.log("editorDidMount -> newValue");
      this.props.updatePane(this.props.paneKey, newValue);
    });
  };

  render() {
    console.log("Editor -> props", this.props);
    monaco.config({ paths: { vs: path.join(__static, "/vs") } });

    const options = {
      selectOnLineNumbers: true,
      minimap: { enabled: false },
      wordWrap: "on",
    };

    return (
      <MonacoEditor
        language="javascript"
        // width="800"
        // height="600"
        theme="dark"
        value={this.props.content}
        options={options}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}

export default Editor;
