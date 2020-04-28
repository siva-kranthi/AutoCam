import React, { Component } from "react";
import { Typography, Tree } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { directoryTree } from "../libs/utils";

const { Text, Title } = Typography;
const { DirectoryTree } = Tree;

const FileTree = React.memo(function FileTree(props) {
  console.log("FileTree -> props", props);

  const directory = props.directory;

  let treeData = [directoryTree(directory)]; // TODO: , { exclude: "/  .git/" })
  console.log("FileTree -> treeData", treeData);
  const expandKey = treeData[0].key;

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
