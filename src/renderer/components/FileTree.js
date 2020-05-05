import React, { Component, useState } from "react";
import { Typography, Tree, notification } from "antd";
import {
  DownOutlined,
  FolderAddOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import fs from "fs";

import { directoryTree } from "../libs/file";

const { Text, Title } = Typography;
const { DirectoryTree } = Tree;

function useForceUpdate() {
  const [value, setValue] = useState(0);
  console.log("=====================FileTree -> value", value); // integer state
  return () => setValue((value) => ++value); // update the state to force render
}

const FileTree = React.memo(function FileTree(props) {
  console.log("FileTree -> props", props);
  let treeData;
  let expandKey;

  const directory = props.directory;
  const forceUpdate = useForceUpdate();

  if (!fs.existsSync(directory)) {
    notification.error({
      message: "Folder not found",
      description: `Default Camera TestCases folder is not found ${directory}`,
    });
    treeData = null;
  } else {
    let result = false;
    if (props.title === "RESULTS EXPLORER") result = true;
    treeData = [
      directoryTree(
        directory,
        {
          exclude: /.(git|svn|hg|CVS|DS_Store|cache)|node_modules/,
        },
        result
      ),
    ];
    console.log("FileTree -> treeData", treeData);
    expandKey = treeData[0].key;
  }

  const onSelect = (keys, event) => {
    console.log("Trigger Select", keys, event);
    props.onSelect(keys);
  };

  const onExpand = () => {
    console.log("Trigger Expand");
  };

  return (
    <>
      <header className="Title">
        <Text strong={true}>{props.title}</Text>
        <div className="Icon">
          <a title="Open the Folder" onClick={props.onClick}>
            <FolderAddOutlined />
          </a>
          <a title="Refresh" onClick={forceUpdate}>
            <SyncOutlined />
          </a>
        </div>
      </header>
      <section className="FileTree">
        <DirectoryTree
          // showIcon
          switcherIcon={<DownOutlined />}
          treeData={treeData}
          defaultExpandedKeys={[expandKey]} // TODO: maintaining expand keys state
          multiple={props.multiple}
          onSelect={onSelect}
          onExpand={onExpand}
          ShowLine
        />
      </section>
    </>
  );
});

export default FileTree;
