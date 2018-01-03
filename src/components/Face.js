import React from 'react'

import Konva from "konva"
import { Circle, Group } from "react-konva";

import Eye from './Eye'

import type { FaceType } from '../types'

import { radiusFromEyes, faceCentreFromEyes, rotationFromEyes, relativeEyesFromFace, toDegrees } from '../utils/translations'

type PropsType = {
    changeCoords: (FaceType => void),
    face: FaceType
}

type StateType = {
    color: string
}

const calculateFace = (eyes) => {
    const calculatedFace = {
        centre: faceCentreFromEyes(eyes),
        radius: radiusFromEyes(eyes),
        rotation: toDegrees(rotationFromEyes(eyes)),
        relativeEyes: null
    }
    calculatedFace.relativeEyes = relativeEyesFromFace(calculatedFace.centre, calculatedFace.radius)

    return calculatedFace
}

export default class Face extends React.Component<PropsType, StateType> {
    constructor(props){
        super(props)
        this.state = {
            color: "green",
            calculatedFace: calculateFace(props.face.eyes)
        };
    }

    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    updateFace =(eyes) => {
        // this.props.changeCoords(eyes)

        this.setState(state => ({
            calculatedFace: calculateFace(eyes)
        }))
    }

    changeCoords = (e) => {
        const attrs = e.target.attrs
        const centre = this.state.calculatedFace.centre
        console.log("attrs")
        console.log(attrs)

        const xShift = attrs.x - centre.x
        const yShift = attrs.y - centre.y

        let eyes = {...this.props.face.eyes}
        eyes.left.x += xShift 
        eyes.left.y += yShift 
        eyes.right.x += xShift 
        eyes.right.y += yShift 

        this.updateFace(eyes)
    }

    moveEye = (eye, e) => {
        // console.log(eye)
        console.log(e.target.attrs)
        const attrs = e.target.attrs
        const eyes = {...this.props.face.eyes}
        const relativeEye = this.state.calculatedFace.relativeEyes[eye]

        const xShift = attrs.x - relativeEye.x
        const yShift = attrs.y - relativeEye.y

        eyes[eye] = {
            x: eyes[eye].x + xShift,
            y: eyes[eye].y + yShift
        }
        this.updateFace(eyes)
    }
    
    moveLeftEye = (newLocation) => this.moveEye("left", newLocation)
    moveRightEye = (newLocation) => this.moveEye("right", newLocation)
    
    render() {
        const face = this.state.calculatedFace

        let eyeOffsetFromCentre = (face.radius / 3)
        return (
            <Group
                x={face.centre.x}
                y={face.centre.y}
                draggable={true}
                onDragEnd={this.changeCoords}
                rotation={face.rotation}>
                <Circle
                    radius={face.radius}
                    stroke={this.state.color}
                    shadowBlur={5}
                    onClick={this.handleClick}
                />
                <Eye
                    {...face.relativeEyes.left}
                    onMove={this.moveLeftEye}
                    />
                <Eye
                    {...face.relativeEyes.right}
                    onMove={this.moveRightEye}
                />
            </Group>

        );
    }
}