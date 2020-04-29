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
  return (
    <header className="Header">
      <div className="header--left">
        <Device></Device>
      </div>
      <div className="header--center">
        <ul className="IconsMenu">
          <li>
            <a title="Save File" onClick={props.saveFile}>
              <SaveOutlined />
            </a>
          </li>
          <li>
            <a title="Run Test cases" onClick={props.runSART}>
              <PlayCircleOutlined />
              {/* <i className="nf nf-fa-play" /> */}
            </a>
          </li>
          <li>
            <a title="Settings" onClick={props.openSettings}>
              {/* <i className="nf nf-mdi-settings" /> */}
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
