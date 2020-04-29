import React from "react";
import {
  FolderAddOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { remote } from "electron";

import Device from "./Device";

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
      <div className="header--left">
        <Device></Device>
      </div>
      <div className="header--center">
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
          <li>
            <a title="Run Test cases" onClick={props.runSART}>
              <PlayCircleOutlined />
              {/* <i class="nf nf-fa-play" /> */}
            </a>
          </li>
          <li>
            <a title="Settings" onClick={props.openSettings}>
              {/* <i class="nf nf-mdi-settings" /> */}
              <SettingOutlined />
            </a>
          </li>
        </ul>
      </div>
      <div className="header--right"></div>
    </header>
  );
}

export default Header;
