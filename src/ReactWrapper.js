import React from "react";
import ElmApp from "./Main.elm";

type Position = {
  x: number,
  y: number
};

type Eyes = {
  left: Position,
  right: Position
};

type PropsType = {
  faces: Array<Eyes>,
  selection: ?number,
  facesDidUpdate: ?(Array<Eyes>, ?number) => void,
  imgUrl: string,
  maxSize: ?{
    width: ?int,
    height: ?int
  }
};

type StateType = {};

export default class extends React.Component<PropsType, StateType> {
  constructor(props) {
    super(props);

    this.handleGetDim = this.handleGetDim.bind(this);
    this.handleFacesChanged = this.handleFacesChanged.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  containerDiv = null;

  handleGetDim = url => {
    // recieve the url for the image through
    // the `getDim` port in Main.elm
    let img = new Image();
    img.src = url;
    img.onload = () => {
      // send the height and width back to elm through
      // the `newDim` port in Main.elm
      this.elmPorts.newDim.send({ height: img.height, width: img.width });
    };
  };

  handleFacesChanged = ([faces, selection]) => {
    this.props.facesDidUpdate && this.props.facesDidUpdate(faces, selection);
  };

  resizeHandler = e => {
    const clientRect = this.containerDiv.getBoundingClientRect();
    const maxSize = {
      width: Math.floor(clientRect.width),
      height: Math.floor(clientRect.height)
    };
    this.elmPorts.newContainerSize.send(maxSize);
  };

  shouldComponentUpdate = nextProps => {
    // if (JSON.stringify(this.props.faces) === JSON.stringify(nextProps.faces) && this.props.selection === nextProps.selection) {
    // } else {
    // }

    if (this.props.imgUrl !== nextProps.imgUrl) {
      let img = new Image();
      img.src = nextProps.imgUrl;
      img.onload = function() {
        this.elmPorts.newState.send([
          nextProps.faces,
          nextProps.selection,
          nextProps.imgUrl,
          { height: img.height, width: img.width }
        ]);
      }.bind(this);
    }

    this.elmPorts.newFaces.send([nextProps.faces, nextProps.selection]);
    return false;
  };

  componentWillUnmount = () => {
    this.elmPorts.getDim.unsubscribe(this.handleGetDim);
    this.elmPorts.facesChanged.unsubscribe(this.handleFacesChanged);
  };

  componentDidMount = () => {
    if (this.containerDiv === null) return;

    const clientRect = this.containerDiv.getBoundingClientRect();

    let faces = [];
    let selection = null;
    const maxSize = {
      width: Math.floor(clientRect.width),
      height: Math.floor(clientRect.height)
    };

    window.addEventListener("resize", this.resizeHandler);

    if (this.props.faces !== undefined) {
      faces = this.props.faces;
    }
    if (this.props.selection !== undefined) {
      selection = this.props.selection;
    }

    console.log(maxSize);
    var app = ElmApp.Main.embed(this.containerDiv, {
      faces: faces,
      selection: selection,
      imgUrl: this.props.imgUrl,
      maxSize: maxSize
    });

    this.elmPorts = app.ports;

    app.ports.getDim.subscribe(this.handleGetDim);
    app.ports.facesChanged.subscribe(this.handleFacesChanged);
  };

  render() {
    return (
      <div
        style={{ width: "100%", height: "100%", textAlign: "left" }}
        ref={ref => {
          this.containerDiv = ref;
        }}
      />
    );
    // React.createElement("div", {
    //   ref: this.initialize,
    //   style: { width: "100%", height: "100%", textAlign: "left" }
    // });
  }
}
