import React, { Component, PureComponent } from "react";
import { Tabs, Button } from "antd";
import { CameraOutlined, SettingOutlined } from "@ant-design/icons";

import Editor from "./Editor";
import Settings from "./Settings";
import Result from "./Result";

const { TabPane } = Tabs;

class TabManager extends Component {
  getTitle = (pane) => {
    return "unSaved" in pane ? (
      <>
        <i className="nf nf-dev-techcrunch" />
        {pane.title}
        <i className="nf nf-oct-primitive_dot" />
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
                <Settings
                  settings={this.props.settings}
                  onRVChange={this.props.onRVChange}
                  onSettingsInputChange={this.props.onSettingsInputChange}
                  onSkipChange={this.props.onSkipChange}
                />
              </div>
            );
          } else if (pane[1].title === "Result") {
            title = (
              <>
                <i className="nf nf-seti-image" /> {pane[1].title}
              </>
            );
            content = (
              <div className="Result">
                <Result content={pane[1].content} resultPath={pane[0]} />
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
