// @flow

import React, { Component } from 'react'
import CanvasState from '../model/CanvasState'
import type { FaceType } from "../types"

type PropsType = {
    faces: Array<FaceType>,
    selected: number,
    imgUrl: ?string,
    imgElement: ?HTMLImageElement,
    imgFile: ?HTMLImageElement,

}
 
type StateType = {}

const imgFromUrl = (url, cb) => {
    var img = new Image();
    img.src = url
    img.onload = function () {
        cb(img)
    } 
}

const imgFromFile = (file, cb) => {
    imgFromUrl(URL.createObjectURL(file), cb)
}

const getImageElementFromProps = (props, cb) => {
    let done = false
    const errorMsg = "you can only specify one of (imgUrl imgElement imgFile) in ImagusFacePicker"
    if (props.imgUrl) {
        done = true
        imgFromUrl(props.imgUrl, cb)
    }
    if (props.imgElement) {
        if (done) {
            console.error(errorMsg)
            throw errorMsg
        }
        done = true
        cb(props.imgElement)
    } 
    if (props.imgFile) {
        if (done) {
            console.error(errorMsg)
            throw errorMsg
        }
        imgFromFile(props.imgFile, cb)
        
    }
}

function bindFirstArg(fn, a) {
    return (b) => {
        return fn(a, b);
    }
}

class Canvas extends Component<PropsType, StateType> {
    canvas : ?HTMLCanvasElement = null
    canvasState : ?CanvasState = null

    setFacesInCanvasState = (props: PropsType) => {
        if (this.canvasState == null) {
            throw "setFacesInCanvasState should only be called once a CanvasState has been created" 
        }
        this.canvasState.clearFaces()
        props.faces &&
          props.faces.forEach((face, idx) => {
            let selected = false
            if (idx === props.selected) {
                selected = true
            }
            this.canvasState.addFace(face, selected)
        });
    }

    componentDidMount() {
        getImageElementFromProps(this.props, img => {
            this.canvasState = new CanvasState(this.canvas, this.props.onFacesUpdate, img)
            this.setFacesInCanvasState(this.props)
        })
    }
    
    componentWillReceiveProps(props: PropsType) {
        getImageElementFromProps(this.props, bindFirstArg(this.setFacesInCanvasState, props))
    }

    render() {
        // console.log("state.faces = ")
        // console.log(this.state.faces)
        return (
            <canvas
                width={500}
                height={500} 
                ref={r => { this.canvas = r }}
            ></canvas>
        );
    }
}

export default Canvas