import React, { Component, PureComponent } from "react";
import { Tabs, Button } from "antd";
import * as fs from "fs";
import Editor from "./Editor";
import Settings from "./Settings";
import { CameraOutlined, SettingOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

class TabManager extends Component {
  getTitle = (pane) => {
    return "unSaved" in pane ? (
      <>
        <i className="nf nf-dev-techcrunch" />
        {pane.title}
        <i class="nf nf-oct-primitive_dot" />
      </>
    ) : (
      <>
        <i className="nf nf-dev-techcrunch" />
        {pane.title}
      </>
    );
  };

  render() {
    console.log("TabManager -> render -> this.props", this.props);

    const panes = Object.entries(this.props.panes);
    console.log("TabManager -> render -> panes", panes);

    return (
      <Tabs
        hideAdd
        onChange={this.props.changePane}
        activeKey={this.props.activeKey}
        type="editable-card"
        onEdit={this.props.editPane}
        animated
      >
        {panes.map((pane, i) => {
          let title, content;

          if (pane[0] === "settings") {
            title = (
              <>
                <SettingOutlined /> {pane[1].title}
              </>
            );
            content = (
              <div className="Settings">
                <Settings />
              </div>
            );
          } else {
            title = this.getTitle(pane[1]);
            content = (
              <Editor
                content={pane[1].content}
                paneKey={pane[0]}
                updatePane={this.props.updatePane}
                activeKey={this.props.activeKey}
              />
            );
          }

          return (
            <TabPane
              tab={title}
              key={pane[0]}
              style={{ height: "calc(100vh - 388px)" }}
            >
              {content}
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

export default TabManager;
