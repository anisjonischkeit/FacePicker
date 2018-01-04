// @flow

import React, { Component } from 'react'
import CanvasState from '../model/CanvasState'
import type { FaceType } from "../types"

type PropsType = {
    faces: Array<FaceType>
}
 
type StateType = {}

class Canvas extends Component<PropsType, StateType> {
    canvas : ?HTMLCanvasElement = null
    canvasState : ?CanvasState = null

    setFacesInCanvasState = (props: PropsType) => {
        if (this.canvasState == null) {
            throw "setFacesInCanvasState should only be called once a CanvasState has been created" 
        }
        this.canvasState.clearFaces()
        props.faces.forEach((face, idx) => {
            let selected = false
            if (idx === props.selected) {
                selected = true
            }
            this.canvasState.addFace(face, selected)
        });
    }

    componentDidMount() {
        this.canvasState = new CanvasState(this.canvas, this.props.onFacesUpdate)
        this.setFacesInCanvasState(this.props)
    }
    
    componentWillReceiveProps(props: PropsType) {
        this.setFacesInCanvasState(props)
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