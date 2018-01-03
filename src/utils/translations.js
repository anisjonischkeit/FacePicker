export const distanceBetweenEyes = ({ left, right }) => {
    const x = Math.abs(left.x - right.x)
    const y = Math.abs(left.y - right.y)

    return Math.sqrt(x*x + y*y)
} 

export const radiusFromEyes = (eyes) => {
    const betweenEyes = distanceBetweenEyes(eyes)
    return betweenEyes + (betweenEyes/2)
}

export const faceCentreFromEyes = (eyes) => {
    var x1 = eyes.left.x;
    var y1 = eyes.left.y;    // First diagonal point
    var x2 = eyes.right.x;
    var y2 = eyes.right.y;    // Second diagonal point

    
    var xc = (x1 + x2) / 2;
    var yc = (y1 + y2) / 2;    // Center point
    var xd = (x1 - x2) / 2;
    var yd = (y1 - y2) / 2;    // Half-diagonal
    // console.log(xc)
    // console.log(yc)
    // console.log(xd)
    // console.log(yd)


    var x3 = (xc + yd);
    var y3 = (yc - xd);

    // return th corner of square
    return {
        x: x3,
        y: y3
    }
}

export const rotationFromEyes = (eyes) => {
    const run = eyes.left.x - eyes.right.x
    const rise = eyes.left.y - eyes.right.y

    return Math.atan2(rise, run) + Math.PI
}

export const relativeEyesFromFace = (centre, radius) => {
    const centreOffset = radius/3

    return {
        left: {
            x: -centreOffset,
            y: -centreOffset,
        },
        right: {
            x: centreOffset,
            y: -centreOffset,

        }
    }
}

export const toDegrees = (angle) => {
    return angle * (180 / Math.PI);
}

export const toRadians = (angle) => {
    return angle * (Math.PI / 180);
}