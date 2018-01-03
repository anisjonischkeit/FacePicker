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

export default class Face extends React.Component<PropsType, StateType> {
    constructor(props){
        super(props)
        this.state = {
            color: "green",
        };
    }

    handleClick = () => {
        this.setState({
            color: Konva.Util.getRandomColor()
        });
    };

    changeCoords = (e) => {
        const attrs = e.target.attrs
        console.log(attrs)
        const coords: FaceType = {
            x: attrs.x,
            y: attrs.y
        }

        this.props.changeCoords(coords)
    }

    moveEye = (newLocation) => {
        console.log(newLocation)
        console.log(newLocation.evt.x)
        console.log(newLocation.evt.y)
    }

    render() {
        const { eyes } = this.props.face
        const calculatedFace = {
            centre: faceCentreFromEyes(eyes),
            radius: radiusFromEyes(eyes),
            rotation: toDegrees(rotationFromEyes(eyes)),
        }
        calculatedFace.relativeEyes = relativeEyesFromFace(calculatedFace.centre, calculatedFace.radius)

        console.log(calculatedFace)
        console.log()
        let eyeOffsetFromCentre = (calculatedFace.radius / 3)
        return (
            <Group
                x={calculatedFace.centre.x}
                y={calculatedFace.centre.x}
                draggable={true}
                onDragEnd={this.changeCoords}
                rotation={calculatedFace.rotation}>
                <Circle
                    radius={calculatedFace.radius}
                    stroke={this.state.color}
                    shadowBlur={5}
                    onClick={this.handleClick}
                />
                <Eye
                    {...calculatedFace.relativeEyes.left}
                    onMove={this.moveEye}
                    />
                <Eye
                    {...calculatedFace.relativeEyes.right}
                    onMove={this.moveEye}
                />
            </Group>

        );
    }
}