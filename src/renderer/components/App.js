import React, { Component } from "react";
import FileTree from "./FileTree";
import Header from "./Header";

class App extends Component {
  state = {
    directory: "C:\\Dev\\AutoCam\\temp\\Camera",
  };

  onOpenDialogSelect = (directory) => {
    this.setState({ directory });
  };

  render() {
    return (
      <>
        <Header onOpenDialogSelect={this.onOpenDialogSelect}></Header>
        <main className="Body">
          <FileTree directory={this.state.directory}> </FileTree>
          <section className="Content"></section>
        </main>
      </>
    );
  }
}

export default App;
