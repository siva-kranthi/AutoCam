import React, { Component } from "react";
import { Tabs, Input, Switch, InputNumber } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

class Settings extends Component {
  render() {
    console.log("Settings -> props", this.props);
    const settings = this.props.settings;

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
          <ul className="settings-list">
            <li>
              <div className="bold">Skip Pre-conditions</div>
              <div>
                Provide the name of the Excel sheet/number (starting from 1).
              </div>
              <div className="margin-top-9">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  id="skip"
                  checked={settings.general.skip}
                  onChange={this.props.onSkipChange}
                />
              </div>
            </li>
            <li>
              <div className="bold">Record Video</div>
              <div>
                Provide the name of the Excel sheet/number (starting from 1).
              </div>
              <div className="margin-top-9">
                <Switch
                  checkedChildren={<CheckOutlined />}
                  unCheckedChildren={<CloseOutlined />}
                  id="record_video"
                  checked={settings.general.record_video}
                  onChange={this.props.onRVChange}
                />
              </div>
            </li>
            <li>
              <div className="bold">Repeat Execution</div>
              <div>
                Provide the name of the Excel sheet/number (starting from 1).
              </div>
              <div className="margin-top-9">
                <Input
                  min={1}
                  max={50}
                  placeholder="Number of repetitions"
                  id="iterations"
                  type="number"
                  value={settings.general.iterations}
                  onChange={this.props.onSettingsInputChange}
                />
              </div>
            </li>
            <li>
              <div className="bold">Rerun Failed</div>
              <div>
                Provide the name of the Excel sheet/number (starting from 1).
              </div>
              <div className="margin-top-9">
                <Input
                  min={1}
                  max={10}
                  placeholder="Rerun count"
                  id="re_run"
                  type="number"
                  value={settings.general.re_run}
                  onChange={this.props.onSettingsInputChange}
                />
              </div>
            </li>
            <li>
              <div className="bold">Loop Count</div>
              <div>
                Provide the name of the Excel sheet/number (starting from 1).
              </div>
              <div className="margin-top-9">
                <Input
                  min={1}
                  max={50}
                  placeholder="Loop Count"
                  id="loop"
                  type="number"
                  value={settings.general.loop}
                  onChange={this.props.onSettingsInputChange}
                />
              </div>
            </li>
          </ul>
        </TabPane>
        <TabPane
          tab={
            <span>
              <i className="nf nf-mdi-vector_intersection" />
              Combination
            </span>
          }
          key="2"
        >
          <ul>
            <li>
              <div className="bold">Execute only Sheets</div>
              <div>
                Provide the name of the Excel sheet/number (starting from 1). By
                default all the sheets will be considered for execution.Provide
                the name of the Excel sheet/number (starting from 1). By default
                all the sheets will be considered for execution.Provide the name
                of the Excel sheet/number (starting from 1). By default all the
                sheets will be considered for execution
              </div>
              <div className="margin-top-9">
                <Input
                  placeholder="Sheet Name/Number"
                  id="sheet"
                  onChange={this.props.onSettingsInputChange}
                  value={settings.combination.sheet}
                />
              </div>
            </li>
          </ul>
        </TabPane>
      </Tabs>
    );
  }
}

export default Settings;
