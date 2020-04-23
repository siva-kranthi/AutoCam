import React, { Component, PureComponent } from "react";
import { Tabs, Button } from "antd";
import * as fs from "fs";
import Editor from "./Editor";

const { TabPane } = Tabs;

class TabManager extends Component {
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
          const title =
            "unSaved" in pane[1] ? `⚈ ${pane[1].title}` : pane[1].title; //\u25CF \u2B24

          return (
            <TabPane
              tab={title}
              key={pane[0]}
              style={{ height: "calc(100vh - 98px)" }}
            >
              {/* {pane[1].content} */}
              <Editor
                content={pane[1].content}
                paneKey={pane[0]}
                updatePane={this.props.updatePane}
              />
            </TabPane>
          );
        })}
      </Tabs>
    );
  }
}

export default TabManager;
