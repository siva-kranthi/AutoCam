import React, { Component } from "react";
import { Typography, Tree } from "antd";
import { directoryTree } from "./utils";
import { DownOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;
const { DirectoryTree } = Tree;

function FileTree(props) {
  const directory = props.directory;

  console.log(directory, directoryTree);

  let treeData = [directoryTree(directory)]; // TODO: , { exclude: "/  .git/" })
  console.log(treeData);
  const expandKey = treeData[0].key;

  const onSelect = (keys, event) => {
    console.log("Trigger Select", keys, event);
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
          showIcon
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          defaultExpandedKeys={[expandKey]}
          multiple
          onSelect={onSelect}
          onExpand={onExpand}
          ShowLine
        />
      </section>
    </nav>
  );
}

export default FileTree;
