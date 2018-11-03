import React, { Component } from "react";

import ImagusFacePicker from "ImagusFacePicker";

export default class App extends Component {
  state = {
    faces: [
      {
        left: {
          x: 96,
          y: 96
        },
        right: {
          x: 143,
          y: 96
        }
      }
    ],
    imgUrl: "/sample_image.jpeg",
    selection: null
  };

  updateFaces = (faces, selection) =>
    this.setState({
      ...this.state,
      faces: faces,
      selection: selection
    });

  render() {
    return (
      // make sure to wrap the imagus face picker in a div with a width and height. The facepicker will stretch or shrink to whatever it div is containing it
      <div style={{ width: "50%", height: "500px" }}>
        <ImagusFacePicker
          faces={this.state.faces}
          selection={this.state.selection}
          facesDidUpdate={this.updateFaces}
          imgUrl={this.state.imgUrl}
        />
      </div>
    );
  }
}
