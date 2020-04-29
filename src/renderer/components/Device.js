import React, { Component } from "react";
import adb from "adbkit";
import { Select, message } from "antd";

const { Option } = Select;
const androidVersions = {
  "5": "Lollipop",
  "6": "Marshmallow",
  "7": "Nougat",
  "8": "Oreo",
  "9": "Pie",
  "10": "Q",
  "11": "R",
  "12": "S",
  "13": "T",
};

// TODO: Test with more than one device

class Device extends Component {
  constructor(props) {
    super(props);
    console.log("Device -> constructor -> props", props);
    this.state = {
      devices: {},
      selected: "",
    };
  }

  componentDidMount() {
    const client = adb.createClient();
    console.log("Device -> componentDidMount -> devices", this.state.devices);

    client
      .trackDevices()
      .then((tracker) => {
        tracker.on("add", (device) => {
          console.log("Device Added -> device", device);
          const { devices } = this.state;

          if (device.type !== "offline") {
            client.getProperties(device.id, (err, properties) => {
              const version = properties["ro.build.version.release"].split(
                "."
              )[0];
              const model = properties["ro.product.model"];

              devices[device.id] = {
                version: androidVersions[version],
                model,
                type: device.type,
              };

              this.setState({ devices });

              message.info(`${model} device is connected`);
            });
          } else {
            devices[device.id] = {
              type: device.type,
            };

            this.setState({ devices });
          }
        });

        tracker.on("remove", (device) => {
          console.log("Device Removed -> device", device);
          const { devices } = this.state;
          const id = device.id;
          const model = "model" in devices[id] ? devices[id]["model"] : id;

          delete devices[id];
          this.setState({ devices });

          message.warning(`${model} device is disconnected`);
        });

        tracker.on("change", (device) => {
          console.log("Device Changed -> device", device);
          const { devices } = this.state;
          const id = device.id;
          const type = device.type;

          if (type !== "offline" && !("model" in devices[id])) {
            client.getProperties(id, (err, properties) => {
              const version = properties["ro.build.version.release"].split(
                "."
              )[0];
              const model = properties["ro.product.model"];

              devices[id] = {
                version: androidVersions[version],
                model,
                type: type,
              };

              this.setState({ devices });
              message.info(`${model} device is online`);
            });
          } else {
            const model = devices[id]["model"];

            devices[id]["type"] = type;
            this.setState({ devices });
            message.warning(`${model} device is offline`);
          }
        });
      })
      .catch(function (err) {
        console.error("Device -> constructor -> err", err);
      });
  }

  updateSelected = (selected) => {
    this.setState({ selected });
  };

  render() {
    console.log("Device -> render -> props", this.props);

    const devices = Object.entries(this.state.devices);
    console.log("Device -> render -> devices", devices);

    if (devices.length === 0)
      return <Select onChange={this.updateSelected}></Select>;
    else
      return (
        <Select value={devices[0][0]} onChange={this.updateSelected}>
          {devices.map((device, i) => {
            let disabled = false;

            if (device[1].type === "offline") disabled = true;

            return (
              <Option value={device[0]} key={device[0]}>
                {"model" in device[1]
                  ? `${device[1].model} (${device[1].version}): ${device[0]} ${device[1].type}`
                  : `${device[0]} ${device[1].type}`}
              </Option>
            );
          })}
        </Select>
      );
  }
}

export default Device;
