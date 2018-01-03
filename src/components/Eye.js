import React from 'react'
import { Circle } from 'react-konva'

type PropsType = {
    x: number,
    y: number
}

export default (props: PropsType) => <Circle
    radius={5}
    x={props.x}
    y={props.y}
    stroke="black"
    shadowBlur={5}
    draggable={true}
    onDragMove={props.onMove}
/>