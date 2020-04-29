import React, { Component } from "react";
import { Tabs, Input, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

class Result extends Component {
  render() {
    console.log("Result -> render -> props", this.props);
    const Result = this.props.Result;

    return <></>;
  }
}

export default Result;
