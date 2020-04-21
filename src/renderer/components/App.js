import React, { Component } from "react";
import FileTree from "./FileTree";

class App extends Component {
  state = {
    directory: "C:\\Dev\\AutoCam\\temp\\Camera",
  };

  render() {
    return (
      <>
        <header className="Header Title"></header>
        <main className="Body">
          <FileTree directory={this.state.directory}> </FileTree>
          <section className="Content"></section>
        </main>
      </>
    );
  }
}

export default App;
