import React from 'react'
import ElmApp from './Main.elm'

type Position = {
    x: number,
    y: number
}

type Eyes = {
    left: Position,
    right: Position
}

type PropsType = {
    faces: Array<Eyes>,
    selection: ?number,
    facesDidUpdate: ?((Array<Eyes>, ?number) => void),
    imgUrl: string,
    maxSize: ?{
        width: ?int,
        height: ?int
    }
}

type StateType = {

}

export default class extends React.Component<PropsType, StateType> {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate = (nextProps) => {
        // if (JSON.stringify(this.props.faces) === JSON.stringify(nextProps.faces) && this.props.selection === nextProps.selection) {
        // } else {
            // }

        if (this.props.imgUrl !== nextProps.imgUrl) {
            let img = new Image()
            img.src = nextProps.imgUrl
            img.onload = function () {
                this.elmPorts.newState.send([nextProps.faces, nextProps.selection, nextProps.imgUrl, { height: img.height, width: img.width }])
            }.bind(this)
        }

        this.elmPorts.newFaces.send([nextProps.faces, nextProps.selection, nextProps.imgUrl])
        return false;
    }

    initialize = node => {
        if(node === null) return;

        this.containerDiv = node
        const clientRect = node.getBoundingClientRect()
        
        let faces = []
        let selection = null
        const maxSize = {
            width: Math.floor(clientRect.width),
            height: Math.floor(clientRect.height)
        }
        
        window.addEventListener("resize", e => {
            const clientRect = this.containerDiv.getBoundingClientRect()
            const maxSize = {
                width: Math.floor(clientRect.width),
                height: Math.floor(clientRect.height)
            }
            this.elmPorts.newContainerSize.send(maxSize)
        })

        if (this.props.faces !== undefined) {
            faces = this.props.faces
        } 
        if (this.props.selection !== undefined) {
            selection = this.props.selection
        } 

        // if (this.props.maxSize) {
        //     if (this.props.maxSize.width !== undefined) {
        //         maxSize.width = this.props.maxSize.width
        //     } 
        //     if (this.props.maxSize.height !== undefined) {
        //         maxSize.height = this.props.maxSize.height
        //     } 
        // }

        console.log(maxSize)
        var app = ElmApp.Main.embed(node, {
            faces: faces,
            selection: selection,
            imgUrl: this.props.imgUrl,
            maxSize: maxSize
        });

        this.elmPorts = app.ports

        app.ports.getDim.subscribe(url => {
            // recieve the url for the image through
            // the `getDim` port in Main.elm
            let img = new Image()
            img.src = url
            img.onload = function () {
                // send the height and width back to elm through
                // the `newDim` port in Main.elm
                app.ports.newDim.send({ height: img.height, width: img.width })
            }
        })

        app.ports.facesChanged.subscribe(([faces, selection]) => {
            this.props.facesDidUpdate && this.props.facesDidUpdate(faces, selection)
        })
    }

    render() {
        return React.createElement('div', { ref: this.initialize, style: { width: "100%", height: "100%", textAlign: "left"} });
    }
} 