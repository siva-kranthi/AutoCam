import React, { Component } from "react";
import { Typography, Tree, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import fs from "fs";

import { directoryTree } from "../libs/file";

const { Text, Title } = Typography;
const { DirectoryTree } = Tree;

const FileTree = React.memo(function FileTree(props) {
  console.log("FileTree -> props", props);
  let treeData;
  let expandKey;

  const directory = props.directory;

  if (!fs.existsSync(directory)) {
    message.error(`Default Camera TestCases folder is not found ${directory}`);
    treeData = null;
  } else {
    treeData = [
      directoryTree(directory, {
        exclude: /.(git|svn|hg|CVS|DS_Store|cache)|node_modules/,
      }),
    ]; // TODO: , { exclude: "/  .git/" })
    console.log("FileTree -> treeData", treeData);
    expandKey = treeData[0].key;
  }

  const onSelect = (keys, event) => {
    console.log("Trigger Select", keys, event);
    props.onFilesSelect(keys);
  };

  const onExpand = () => {
    console.log("Trigger Expand");
  };

  return (
    <nav className="FileTreeContainer">
      <header className="Title">
        <Text strong={true}>TEST CASES EXPLORER</Text>
      </header>
      <section className="FileTree">
        <DirectoryTree
          // showIcon
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          defaultExpandedKeys={[expandKey]} // TODO: maintaining expand keys state
          multiple
          onSelect={onSelect}
          onExpand={onExpand}
          // ShowLine
        />
      </section>
    </nav>
  );
});

export default FileTree;
