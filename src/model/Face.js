export default class Face {

    constructor(faceObj: Object) {
        this.eyes = faceObj.eyes
        this.centre = faceObj.centre
        this.radius = faceObj.radius
        this.color = faceObj.color || '#EEE'
        this.rotation = this.getFaceRotation()
    }

    // used to get the initial rotation of the face based on the eyes
    getFaceRotation = function () {
        const rise = this.eyes.left.x - this.eyes.right.x
        const run = this.eyes.left.y - this.eyes.right.y
        // if(Math.atan(rise/run) > 0){
        return - Math.atan2(rise, run)
        // }
        // return - Math.atan(rise/run)
    }

    // draws a face object based on its parameters
    draw = function (ctx, selected) {

        // the color of a selected face
        const selectionColor = '#3eb049'

        // the current faces defaultColor
        const defaultColor = this.color

        ctx.fillStyle = defaultColor;
        ctx.strokeStyle = defaultColor;

        // if the face should get selected change the color of the fill and stroke
        if (selected) {
            ctx.fillStyle = selectionColor;
            ctx.strokeStyle = selectionColor;
        }

        // if the radius is less than 5 set it to 5 so that faces dont get too small
        if (this.radius < 5) {
            this.radius = 5;
        }

        // Draw eyes
        this.ctx = ctx
        ctx.beginPath()
        ctx.arc(this.eyes.left.x, this.eyes.left.y, 2, 0, 2 * Math.PI, false);
        ctx.fill()
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(this.eyes.right.x, this.eyes.right.y, 2, 0, 2 * Math.PI, false);
        ctx.fill()
        ctx.stroke()

        // Draw Face
        ctx.beginPath()
        ctx.lineWidth = 4;
        ctx.arc(this.centre.x, this.centre.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke()

        // Draw Arrow
        /*ctx.save()
        ctx.translate(this.centre.x, this.centre.y);
        ctx.rotate(this.rotation)
        ctx.lineWidth = 2;
      
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.radius/2, 0);
        ctx.lineTo(this.radius/3 , this.radius/8);
        ctx.moveTo(this.radius/2, 0);
        ctx.lineTo(this.radius/3 , -(this.radius/8));
        ctx.stroke();
      
        ctx.restore()*/

    }

    // returns true if x and y are withing the regions of our face object
    contains = function (x, y) {
        return this.circleContains(x, y, this.centre, this.radius)
    }

    // returns true if x and y are within the regions of a given circle 
    // (used for checking if x and y are within the regions of a face or the drag handle)
    circleContains = function (x, y, centre, radius) {
        return Math.sqrt((centre.x - x) * (centre.x - x) + (centre.y - y) * (centre.y - y)) < radius
    }

    // returns true if x and y are withing the regions of the resize corners that would be on our face
    cornerContains = function (x, y) {

        return (
            // returns true if outside of the circle 
            !this.contains(x, y)

            // returns true if inside of square
            && (this.centre.x + this.radius >= x) && (this.centre.x - this.radius <= x) && (this.centre.y + this.radius >= y) && (this.centre.y - this.radius <= y)
        )
    }

    eyeContains = function (x, y, shiftedHandleLength, shiftedHandleRadius) {
        let eyeRad = 12

        if (this.circleContains(x, y, this.eyes.left, eyeRad) || (shiftedHandleLength && shiftedHandleRadius && this.circleContains(x, y, { x: this.eyes.left.x, y: this.eyes.left.y + shiftedHandleLength }, shiftedHandleRadius))) // (this.eyes.left.x + eyeRad >= x) && (this.eyes.left.x  - eyeRad <= x) && (this.eyes.left.y + eyeRad >= y) && (this.eyes.left.y - eyeRad <= y))
            return 'left'
        else if (this.circleContains(x, y, this.eyes.right, eyeRad) || (shiftedHandleLength && shiftedHandleRadius && this.circleContains(x, y, { x: this.eyes.right.x, y: this.eyes.right.y + shiftedHandleLength }, shiftedHandleRadius))) //(this.eyes.right.x + eyeRad >= x) && (this.eyes.right.x  - eyeRad <= x) && (this.eyes.right.y + eyeRad >= y) && (this.eyes.right.y - eyeRad <= y))
            return 'right'
        else
            return false
    }

    // returns true if x and y are withing the regions of the drag handle
    dragHandleContains = function (x, y, dragHandleLine, dragHandleRadius) {

        // length of the hypotenuse that we use to calculate the centrepoint of our drag handle
        // this length is the sum of the radius, length of the drag handle line and the radius of the drag handle circle
        const hypotenuse = this.radius + dragHandleLine + dragHandleRadius

        // calculate the centre of the drag handle
        var dragHandleCentre = {
            x: this.centre.x - (Math.cos(this.rotation) * hypotenuse),
            y: this.centre.y - (Math.sin(this.rotation) * hypotenuse)
        }

        // test if x and y are within the drag handle circle
        return this.circleContains(x, y, dragHandleCentre, dragHandleRadius)
    }

    setFaceCentre = function () {
        var x1 = this.eyes.left.x;
        var y1 = this.eyes.left.y;    // First diagonal point
        var x2 = this.eyes.right.x;
        var y2 = this.eyes.right.y;    // Second diagonal point


        var xc = (x1 + x2) / 2;
        var yc = (y1 + y2) / 2;    // Center point
        var xd = (x1 - x2) / 2;
        var yd = (y1 - y2) / 2;    // Half-diagonal


        var x3 = (xc + yd);
        var y3 = (yc - xd);

        // return th corner of square
        this.centre.y = y3;
        this.centre.x = x3;
    }

    getDistBetweenEyes = function () {
        var xDist = (this.eyes.left.x - this.eyes.right.x)
        var yDist = (this.eyes.left.y - this.eyes.right.y)

        // this.rotation =  - Math.PI - Math.atan(xDist/yDist)
        return Math.sqrt((xDist * xDist) + (yDist * yDist));
    }

    setRadiusFromEyePos = function () {
        this.radius = (this.getDistBetweenEyes() * 3) / 2
    }

    updateFaceOnEyesChange = function () {
        this.setFaceCentre()
        this.setRadiusFromEyePos()
        this.rotation = this.getFaceRotation()
    }

    getEyes = function () {
        // get the radius (distance) from the centre to the left and right eye
        var eyeRad: { left: number, right: number }
        eyeRad = {
            left: Math.sqrt(Math.pow(this.centre.x - this.eyes.left.x, 2) + Math.pow(this.centre.y - this.eyes.left.y, 2)),
            right: Math.sqrt(Math.pow(this.centre.x - this.eyes.right.x, 2) + Math.pow(this.centre.y - this.eyes.right.y, 2))
        }

        // rotate left eye around the centre using the radius to the left eye and the 
        // rotation angle we got from our mouse position. the offset of Math.PI +/- Math.PI/4 is added
        // to compensate for the eyes being in different positions
        this.eyes.left.x = this.centre.x + Math.cos((Math.PI - Math.PI / 4) + this.rotation) * eyeRad.left
        this.eyes.left.y = this.centre.y + Math.sin((Math.PI - Math.PI / 4) + this.rotation) * eyeRad.left
        this.eyes.right.x = this.centre.x + Math.cos((Math.PI + Math.PI / 4) + this.rotation) * eyeRad.right
        this.eyes.right.y = this.centre.y + Math.sin((Math.PI + Math.PI / 4) + this.rotation) * eyeRad.right
    }
}