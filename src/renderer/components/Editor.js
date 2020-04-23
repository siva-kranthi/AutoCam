import React, { Component, useRef } from "react";
import * as path from "path";

delete window.require;
delete window.exports;
delete window.module;

import MonacoEditor, { ControlledEditor, monaco } from "@monaco-editor/react";

const Editor = React.memo(function Editor(props) {
  console.log("Editor -> props", props);
  const valueGetter = useRef();

  const editorDidMount = (getValue, editor) => {
    editor.focus();
    editor.onDidChangeModelContent((ev) => {
      const newValue = editor.getValue();
      console.log("editorDidMount -> newValue", newValue);
      props.updatePane(props.paneKey, newValue);
    });
  };

  // const onChange = (newValue, e) => {
  //   console.log("onChange -> props.paneKey", props.paneKey);
  //   console.log("onChange -> newValue", newValue);
  //   props.updatePane(props.paneKey, newValue);
  // };

  monaco.config({ paths: { vs: path.join(__static, "/vs") } });
  // monaco.config({
  //   urls: {
  //     monacoLoader: path.join(__static, "/vs/loader.js"),
  //     monacoBase: path.join(__static, "/vs"),
  //   },
  // });

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
      value={props.content}
      options={options}
      editorDidMount={editorDidMount}
    />
  );
});

export default Editor;
