// @flow

import React, { Component } from 'react'

import CanvasState from '../model/canvasState'
import type { FaceType } from '../types'

import Konva from "konva"
import { Stage, Layer, Circle, Text, Group } from "react-konva";

import Face from "./Face"

type PropsType = {

}

type StateType = {
    faces: Array<FaceType>
}

class Canvas extends Component<PropsType, StateType> {
  state = {
    faces: [
      {
        eyes:{
            left: {
                x: 20,
                y: 20,
            },
            right: {
                x: 20,
                y: 40,
            }
        }
      }
    ]
  }

  changeCoords = (faceId: number, face: FaceType) => {
    this.setState((state: StateType) => {
      let faces = [...state.faces]
      faces[faceId] = {
        ...faces[faceId],
        eyes: face
      }
      return { faces: faces }
    })
  }

  render() {
    // console.log("state.faces = ")
    // console.log(this.state.faces)
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text text="Try click on rect" />
          {this.state.faces.map((face, idx) => (
            <Face
              face={face}
              changeCoords={(face: FaceType) => this.changeCoords(idx, face)}
            />
          ))}
        </Layer>
      </Stage>
    );
  }
}

export default Canvas