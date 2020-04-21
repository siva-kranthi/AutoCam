import React from "react";
import { FolderAddOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { remote } from "electron";

const dialog = remote.dialog;

function Header(props) {
  let dir;

  const options = {
    title: "Select Test Cases Folder",
    buttonLabel: "Select TCs Folder",
    properties: ["openDirectory"],
  };

  const openDialog = () => {
    dir = dialog.showOpenDialogSync(options);
    console.log(dir);
    console.log("hiihii");
    props.onOpenDialogSelect(dir[0]);
  };

  return (
    <header className="Header">
      <ul className="IconsMenu">
        <li>
          <a title="Open the Folder" onClick={openDialog}>
            <FolderAddOutlined />
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
