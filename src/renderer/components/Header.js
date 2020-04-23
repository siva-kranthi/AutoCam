import React from "react";
import {
  FolderAddOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { remote } from "electron";

const dialog = remote.dialog;

function Header(props) {
  let dir;

  const options = {
    title: "Select Test Cases Folder",
    buttonLabel: "Select TCs Folder",
    properties: ["openDirectory"],
  };

  // Opening folder select dialog
  const onClick = () => {
    dir = dialog.showOpenDialogSync(options);
    console.log(dir);
    console.log("hiihii");
    props.setDirectory(dir[0]);
  };

  return (
    <header className="Header">
      <ul className="IconsMenu">
        <li>
          <a title="Open the Folder" onClick={onClick}>
            <FolderAddOutlined />
          </a>
        </li>
        <li>
          <a title="Save File" onClick={props.saveFile}>
            <SaveOutlined />
          </a>
        </li>
        <li className="run">
          <a title="Run Test cases">
            <PlayCircleOutlined />
          </a>
        </li>
      </ul>
    </header>
  );
}

export default Header;
