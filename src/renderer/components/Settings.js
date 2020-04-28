import React, { PureComponent } from "react";
import { Tabs } from "antd";

const { TabPane } = Tabs;

class Settings extends PureComponent {
  render() {
    console.log("Settings -> props", this.props);

    return (
      <Tabs defaultActiveKey="1" tabPosition="left">
        <TabPane
          tab={
            <>
              <i className="nf nf-oct-terminal" />
              General
            </>
          }
          key="1"
        >
          Tab 1
        </TabPane>
        <TabPane
          tab={
            <span>
              <i className="nf nf-mdi-vector_intersection" />
              Tab 2
            </span>
          }
          key="2"
        >
          Tab 2
        </TabPane>
      </Tabs>
    );
  }
}

export default Settings;
