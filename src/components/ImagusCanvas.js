// @flow

import React, { Component } from 'react'
import CanvasState from '../model/CanvasState'
import Face from "../model/Face"
import type { FaceType } from "../types"
import { getEyes, faceCentreFromEyes, radiusFromEyes } from '../utils/translations'

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
    console.log(props.imgUrl)
    if (props.imgUrl) {
        done = true
        imgFromUrl(props.imgUrl, cb)
    }
    else if (props.imgElement) {
        if (done) {
            console.error(errorMsg)
            throw errorMsg
        }
        done = true
        cb(props.imgElement)
    } 
    else if (props.imgFile) {
        if (done) {
            console.error(errorMsg)
            throw errorMsg
        }
        imgFromFile(props.imgFile, cb)
    }
    else cb()
}

function bindFirstArg(fn, a) {
    return (b) => {
        return fn(a, b);
    }
}

const createFaceObj = (face) => {
    const faceObj = { ...face }
    faceObj.centre = faceCentreFromEyes(face.eyes)
    faceObj.radius = radiusFromEyes(face.eyes)

    return new Face(faceObj);
}

class Canvas extends Component<PropsType, StateType> {
    canvas : ?HTMLCanvasElement = null
    canvasState : ?CanvasState = null

    setFacesInCanvasState = (props: PropsType, img) => {
        if (this.canvasState == null) {
            throw "setFacesInCanvasState should only be called once a CanvasState has been created" 
        }

        console.log("faces = ", JSON.stringify(props.faces, null , 2))

        // this.canvasState.setUserVariables(props.onFacesUpdate, img)
        

        if (props.faces) {
            const faceObjs = props.faces.map(face => createFaceObj(face));
            this.canvasState.faces = faceObjs
            this.canvasState.selected = props.selected
        }

       

    }

    componentDidMount() {
        getImageElementFromProps(this.props, img => {
            console.log(1, img)
        })
        this.canvasState = new CanvasState(this.canvas, this.props.onFacesUpdate)
        this.setFacesInCanvasState(this.props)//, img)
    }
        
    componentWillReceiveProps(props: PropsType) {
            // console.log("updateState", props.imgUrl)
            // getImageElementFromProps(props, bindFirstArg(this.setFacesInCanvasState, props))
            this.setFacesInCanvasState(props)//, img)
    }

    render() {
        return (
            <canvas
                width={this.props.width || 500}
                height={this.props.width || 500} 
                ref={r => { this.canvas = r }}
            ></canvas>
        );
    }
}

export default Canvas