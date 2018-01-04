import Face from './Face'
import { getEyes, faceCentreFromEyes, radiusFromEyes } from '../utils/translations'

type CanvasStateType = {
    canvas: HTMLCanvasElement,
    width: number,
    height: number
}

function isTouchDevice() {
    return (('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0));
}

var myState = null 

export default class CanvasState {
    constructor(canvas: HTMLCanvasElement, updateFaces: (faces) => void, bgImage: HTMLImageElement) {
        this.canvas = canvas
        this.bgImage = bgImage
        this.updateFaces = updateFaces

        this.width = canvas.width
        this.height = canvas.height

        this.ctx = canvas.getContext('2d');


        //used for getting an accurate mouse position when an image is resized
        this.scaleFactor = {
            x: canvas.clientWidth / this.width,
            y: canvas.clientHeight / this.height
        }

        this.valid = false; // when set to false, the canvas will redraw everything
        this.faces = [];  // the collection of things to be drawn
        this.dragging = false; // Keep track of when we are dragging
        this.draggingEye = false; // Keep track of when we are dragging
        this.onSquare = false; // Keeps track of when we are on the resize corner
        this.rotating = false; // Keeps track of when we are on the rotation handle
        this.direction = null // Direction in which we are resizing
        this.mouseMoved = false // Tests if the mouse has moved (needed to determine if a mobile user tappped or swiped)
        this.justSelected = false // tests if a face was selected on the last mousedown event (mobile ^)
        this.lastTapTime = 0; // used to check if we double tapped
        this.doubleClickTimer = null; // timer used to do a single click instead of a double click

        this.currentCursor = 'default'


        this.selection = null; // The index of the selected face in our faces array
        this.dragoffx = 0; // See mousedown and mousemove events for explanation
        this.dragoffy = 0;
        this.isTouchDevice = false

        if (isTouchDevice()) {
            this.isTouchDevice = true
        }

        // **** Options! ****

        this.toolColor = '#AAA'; // the color which our resize and rotate tools will be
        this.toolLineWidth = 2; // the linewidth which our resize and rotate tools will have
        this.interval = 30; // how often the screen redraws
        this.rotateLine = 12 // the length of the rotation handle line
        this.rotateRad = 8 // the length of the rotation handle

        this.eyeGrabRegionRadius = 12
        this.shiftedEyeHandleLength = 25
        this.shiftedEyeHandleRadius = 16

        if (window.innerWidth < canvas.width) {
            this.eyeGrabRegionRadius *= (canvas.width / window.innerWidth)
            this.shiftedEyeHandleLength *= (canvas.width / window.innerWidth)
            this.shiftedEyeHandleRadius *= (canvas.width / window.innerWidth)
            this.rotateRad *= (canvas.width / window.innerWidth) // the length of the rotation handle
        }

        // **** Then events! ****

        // This is an example of a closure!
        // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
        // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
        // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
        // This is our reference!
        myState = this;

        // updates the scale factor when the window resizes (when the canvas could have a different size)
        window.onresize = function (event) {
            this.scaleFactor = {
                x: this.canvas.clientWidth / this.width,
                y: this.canvas.clientHeight / this.height
            }
        }.bind(this);

        this.addEventListeners()

        setInterval(function () { myState.draw(); }, myState.interval);
    }

    mouseDown = function (e, isMouse) {
        var mouse = myState.getMouse(e);

        var mx = mouse.x;
        var my = mouse.y;
        var faces = myState.faces;
        var l = faces.length;
        var mySel

        // alert(mx + ' ' + my)


        // tests to see if an eye has been selected
        var insideEye
        if (myState.selection !== null) {
            if (this.isTouchDevice) {
                insideEye = faces[myState.selection].eyeContains(mx, my, this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius + this.eyeGrabRegionRadius, this.shiftedEyeHandleRadius)
            } else {
                insideEye = faces[myState.selection].eyeContains(mx, my)
            }
        }
        if (insideEye) {
            e.preventDefault();
            mySel = faces[myState.selection];
            myState.dragging = true;
            myState.draggingEye = insideEye;
            if (insideEye === 'left') {
                myState.dragoffx = mx - mySel.eyes.left.x;
                myState.dragoffy = my - mySel.eyes.left.y;
            } else if (insideEye === 'right') {
                myState.dragoffx = mx - mySel.eyes.right.x;
                myState.dragoffy = my - mySel.eyes.right.y;
            }
            return
        }

        // tests if a face has been selected and its resize handle has been touched
        if (myState.selection !== null && faces[myState.selection].dragHandleContains(mx, my, myState.rotateLine, myState.rotateRad)) {
            e.preventDefault();
            mySel = faces[myState.selection];
            myState.rotating = true;
            myState.dragging = true;

            return;
        }

        // tests if a face has been selected and one of the corners has been selected
        if (myState.selection !== null && faces[myState.selection].cornerContains(mx, my)) {
            e.preventDefault();
            mySel = faces[myState.selection];

            // Keep track of where in the object we clicked
            // so we can move it smoothly (see mousemove)
            myState.dragging = true;
            myState.onSquare = true;
            myState.valid = false;

            if (mouse.x < faces[myState.selection].centre.x) {
                //top left
                if (mouse.y < faces[myState.selection].centre.y) {
                    myState.direction = 'TL'
                    mx += ((mySel.centre.x - mx) * 2);
                    my += ((mySel.centre.y - my) * 2);
                } else {//bottom left
                    myState.direction = 'BL'
                    mx += ((mySel.centre.x - mx) * 2);
                }
            } else { // right off the box
                //top right
                if (mouse.y < faces[myState.selection].centre.y) {
                    myState.direction = 'TR'
                    my += ((mySel.centre.y - my) * 2);
                } else {//bottom right
                    myState.direction = 'BR'
                }
            }

            myState.dragoffx = mx - mySel.radius - mySel.centre.x;
            myState.dragoffy = my - mySel.radius - mySel.centre.y;

            return;
        }

        // tests if mousedown happened inside an area where a face is
        for (var i = l - 1; i >= 0; i--) {
            if (faces[i].contains(mx, my)) {
                e.preventDefault();
                myState.justSelected = true
                mySel = faces[i];

                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                myState.dragoffx = mx - mySel.centre.x;
                myState.dragoffy = my - mySel.centre.y;
                myState.dragging = true;
                myState.selection = i;
                myState.valid = false;
                myState.currentCursor = 'move';
                myState.canvas.style.cursor = myState.currentCursor;
                return;
            }
        }

        // if we havent returned by this point it means we have failed to select anything of relevence.
        // If there was an object selected, we deselect it.
        // we only do this when it is an actual mouse since it could have been a swipe on a mobile device
        if (isMouse && myState.selection !== null) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }

    };

    mouseMove = function (e, isMouse) {
        myState.mouseMoved = true
        if (myState.dragging) {
            e.preventDefault();
            let mouse = myState.getMouse(e);

            if (myState.draggingEye) {
                let face = myState.faces[myState.selection]
                if (myState.draggingEye === 'left') {
                    face.eyes.left.x = mouse.x - myState.dragoffx
                    face.eyes.left.y = mouse.y - myState.dragoffy
                } else if (myState.draggingEye === 'right') {
                    face.eyes.right.x = mouse.x - myState.dragoffx
                    face.eyes.right.y = mouse.y - myState.dragoffy
                }
                face.updateFaceOnEyesChange()
            }

            // if the outside square was selected, resize the image
            else if (myState.onSquare) {
                let face = myState.faces[myState.selection],
                    startX = face.centre.x - face.radius - myState.dragoffx, // the top most and left most points of our face
                    startY = face.centre.y - face.radius - myState.dragoffy,
                    endX = face.centre.x + face.radius + myState.dragoffx, // the bottom most and right most points of our face
                    endY = face.centre.y + face.radius + myState.dragoffy


                var scaleFactor
                switch (myState.direction) {
                    case 'TR':
                        scaleFactor = Math.max(startY - mouse.y, mouse.x - endX)
                        break
                        
                    case 'TL':
                        scaleFactor = Math.max(startY - mouse.y, startX - mouse.x)
                        break
                        
                    case 'BR':
                        scaleFactor = Math.max(mouse.x - endX, mouse.y - endY)
                        break
                        
                    case 'BL':
                        scaleFactor = Math.max(mouse.y - endY, startX - mouse.x)
                        break
                        
                    default:
                        // do nothing
                        break
                }

                face.radius += scaleFactor;
                face.eyes = getEyes(face.centre, face.radius *2, face.rotation)
                face.getEyes()

                // if the rotate handle was selected then we should rotate the face
            } else if (myState.rotating) {
                var mySel = myState.faces[myState.selection]

                // Get the angle at which the mouse is from the centre
                // The angles that tan gives us is between 0 and PI so we only get half of the circle
                // NOTE: PI/2 needs to be added in both cases to adjust for the starting position of the rotation handle
                // being at the top of the face rather than at the side (where 0 Radians would be)
                if (mouse.y < mySel.centre.y) {
                    // if the mouse is positioned above the centre of the object then we take the tan value
                    mySel.rotation = Math.PI / 2 + Math.atan((mouse.x - mySel.centre.x) / (mySel.centre.y - mouse.y))
                } else {
                    // if the mouse is positioned below the centre of the object then we add PI to the value to get the other side of the circle
                    mySel.rotation = Math.PI + Math.PI / 2 + Math.atan((mouse.x - mySel.centre.x) / (mySel.centre.y - mouse.y))
                }

                mySel.getEyes()

            } else {
                // if we weren't rotating or resizing but we are dragging then we must be moving the object

                // eye positions relative to the centre before the centre gets changed
                // we need to keep track of this so that we can we can calculate where
                // the eyes should end up
                var relativeEyePos = {
                    left: {
                        x: (myState.faces[myState.selection].centre.x - myState.faces[myState.selection].eyes.left.x),
                        y: (myState.faces[myState.selection].eyes.left.y - myState.faces[myState.selection].centre.y)
                    },
                    right: {
                        x: (myState.faces[myState.selection].eyes.right.x - myState.faces[myState.selection].centre.x),
                        y: (myState.faces[myState.selection].eyes.right.y - myState.faces[myState.selection].centre.y)
                    }
                }

                // We don't want to drag the object from the centre, we want to drag it
                // from where we clicked. Thats why we saved the offset and use it here

                //set new centre points for the current face
                myState.faces[myState.selection].centre.x = mouse.x - myState.dragoffx;
                myState.faces[myState.selection].centre.y = mouse.y - myState.dragoffy;

                //set the new eye positions
                myState.faces[myState.selection].eyes.left.x = myState.faces[myState.selection].centre.x - relativeEyePos.left.x;
                myState.faces[myState.selection].eyes.left.y = myState.faces[myState.selection].centre.y + relativeEyePos.left.y;
                myState.faces[myState.selection].eyes.right.x = myState.faces[myState.selection].centre.x + relativeEyePos.right.x;
                myState.faces[myState.selection].eyes.right.y = myState.faces[myState.selection].centre.y + relativeEyePos.right.y;


            }

            myState.valid = false; // Something's being dragged so we must redraw
        } else if (isMouse) {
            let mouse = myState.getMouse(e);
            var newCursor;

            for (var i = 0; i < myState.faces.length; i++) {
                let face = myState.faces[i]
                if (face.contains(mouse.x, mouse.y)) {
                    newCursor = 'pointer';
                    break;
                }
            }
            if (myState.selection !== null) {
                let face
                face = myState.faces[myState.selection];
                if (face.eyeContains(mouse.x, mouse.y) || (this.isTouchDevice && face.eyeContains(mouse.x, mouse.y, this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius + this.eyeGrabRegionRadius, this.shiftedEyeHandleRadius)) || face.dragHandleContains(mouse.x, mouse.y, myState.rotateLine, myState.rotateRad)) {
                    newCursor = 'pointer';
                } else if (face.contains(mouse.x, mouse.y)) {
                    newCursor = 'move';
                } else if (face.cornerContains(mouse.x, mouse.y)) {
                    if (face.centre.x < mouse.x) { // mouse is to the right
                        if (face.centre.y < mouse.y) { // bottom right
                            newCursor = 'nw-resize';
                        } else { // top right
                            newCursor = 'ne-resize';
                        }
                    } else {
                        if (face.centre.y < mouse.y) { // bottom left
                            newCursor = 'ne-resize';
                        } else { // top left
                            newCursor = 'nw-resize';
                        }
                    }
                }
            }

            if (!newCursor) {
                if (myState.currentCursor !== 'default' && myState.currentCursor !== '-webkit-grabbing') {
                    myState.currentCursor = 'default';
                    myState.canvas.style.cursor = myState.currentCursor;
                }
            } else if (newCursor !== myState.currentCursor) {
                myState.currentCursor = newCursor;
                myState.canvas.style.cursor = myState.currentCursor;
            }
        }
    };

    // reset all dragging states since we nolonger have anything selected with the mouse
    mouseUp = function (e, isMouse) {
        if ((!isMouse && !myState.mouseMoved && !myState.justSelected) && myState.selection !== null) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
        myState.justSelected = false;
        myState.mouseMoved = false;
        myState.dragging = false;
        myState.draggingEye = false;
        myState.onSquare = false;
        myState.rotating = false;

        const returnableFaces = myState.faces.map(face => ({
            eyes: face.eyes
        }))
        myState.updateFaces(returnableFaces)
    };

    didDoubleTap = function () {

        var now = new Date().getTime();
        var timesince = now - myState.lastTapTime;

        myState.lastTapTime = now;
        if ((timesince < 250) && (timesince > 100)) {
            // double tap
            return true
        } else {
            // too much time to be a doubletap
            return false
        }

    }

    // double click for creating and deleting new shapes
    doubleClick = function (e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var faces = myState.faces
        var l = faces.length

        // if there is a face in the location of the mouse then remove that face from our faces array and redraw
        for (var i = l - 1; i >= 0; i--) {
            if (faces[i].contains(mx, my)) {
                myState.faces.splice(i, 1);
                myState.selection = null
                myState.valid = false
                return;
            }
        }
        // otherwise add a new face
        myState.addFace({
                eyes: {
                    left: {
                        x: mouse.x - 20,
                        y: mouse.y - 20
                    },
                    right: {
                        x: mouse.x + 20,
                        y: mouse.y - 20
                    }
                },
                centre: {
                    x: mouse.x,
                    y: mouse.y
                },
                radius: 60
            }
        );
    }


    // add a face and unless we explicitly say don't select it, it should be selected
    // then redraw
    addFace = function (face, selected) {
        const faceObj = {...face}
        faceObj.centre = faceCentreFromEyes(face.eyes)
        faceObj.radius = radiusFromEyes(face.eyes)

        
        this.faces.push(new Face(faceObj));
        if (selected !== false)
            this.selection = this.faces.length - 1

        this.valid = false;
    }

    clearFaces = () => myState.faces = []

    //clears the canvas
    clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    // While draw is called as often as the INTERVAL variable demands,
    // It only ever does something if the canvas gets invalidated by our code
    draw = function () {

        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            var ctx = this.ctx;
            var faces = this.faces;
            this.clear();

            // load background image first so that everything else gets played ontop of it
            if (this.bgImage) {
                this.ctx.drawImage(this.bgImage, 0, 0, this.bgImage.width, this.bgImage.height);
            }

            // draw all shapes
            var l = faces.length;
            for (var i = 0; i < l; i++) {
                var face = faces[i];
                // We can skip the drawing of elements that have moved off the screen:
                if (face.centre.x - face.radius > this.width || face.centre.y - face.radius > this.height ||
                    face.centre.x + face.radius < 0 || face.centre.y + face.radius < 0) continue;

                // if the current face is the selected face, draw tools around it (resize and rotate)
                if (this.selection != null && this.selection === i) {
                    face.draw(ctx, true);
                    ctx.strokeStyle = this.toolColor;
                    ctx.lineWidth = this.toolLineWidth;

                    // draws the resize box
                    ctx.save()
                    ctx.translate(face.centre.x, face.centre.y);

                    // ctx rotate will rotate the resize box to the correct rotation however,
                    // Face.cornerContains needs to be modified to accomodate for the rotation
                    // so this feature hase been commented out
                    // ctx.rotate(face.rotation)

                    ctx.strokeRect(0 - face.radius, 0 - face.radius, face.radius * 2, face.radius * 2);
                    ctx.restore()

                    ctx.strokeStyle = this.toolColor;
                    ctx.fillStyle = this.toolColor;
                    ctx.lineWidth = this.toolLineWidth;


                    // draws the rotate drag handle
                    ctx.save()
                    ctx.translate(face.centre.x, face.centre.y);
                    ctx.rotate(face.rotation)

                    ctx.faceWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0 - face.radius, 0);
                    ctx.lineTo(0 - face.radius - this.rotateLine, 0);
                    ctx.stroke();

                    ctx.beginPath()
                    ctx.lineWidth = this.toolLineWidth + 1
                    ctx.arc(0 - face.radius - this.rotateLine - this.rotateRad, 0, this.rotateRad, 0, 2 * Math.PI, false);
                    // ctx.fill();
                    ctx.stroke()

                    ctx.restore()

                    //draw handles around eyes
                    ctx.beginPath()
                    ctx.arc(face.eyes.left.x, face.eyes.left.y, this.eyeGrabRegionRadius, 0, 2 * Math.PI, false);
                    ctx.stroke()

                    ctx.beginPath()
                    ctx.arc(face.eyes.right.x, face.eyes.right.y, this.eyeGrabRegionRadius, 0, 2 * Math.PI, false);
                    ctx.stroke()

                    if (this.isTouchDevice) {
                        ctx.save()

                        ctx.setLineDash([5, 5]);

                        ctx.beginPath();
                        ctx.moveTo(face.eyes.left.x, face.eyes.left.y + this.eyeGrabRegionRadius);
                        ctx.lineTo(face.eyes.left.x, face.eyes.left.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength);
                        ctx.stroke();

                        ctx.beginPath()
                        ctx.arc(face.eyes.left.x, face.eyes.left.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius, this.shiftedEyeHandleRadius, 0, 2 * Math.PI, false);
                        ctx.stroke()

                        ctx.beginPath();
                        ctx.moveTo(face.eyes.right.x, face.eyes.right.y + this.eyeGrabRegionRadius);
                        ctx.lineTo(face.eyes.right.x, face.eyes.right.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength);
                        ctx.stroke();

                        ctx.beginPath()
                        ctx.arc(face.eyes.right.x, face.eyes.right.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius, this.shiftedEyeHandleRadius, 0, 2 * Math.PI, false);
                        ctx.stroke()

                        ctx.restore()
                    }

                } else {
                    // if the current face is not the selected face, just draw it but do not select it
                    face.draw(ctx, false);
                }
            }

            // set the state to valid as everything has been redrawn so it doesn't need to be redrawn again
            this.valid = true;
        }
    }

    // this function is used to set the canvas element if it was unset
    setCanvasElement = function (canvas) {
        this.canvas = canvas
        this.width = canvas.width
        this.height = canvas.height
        this.ctx = canvas.getContext('2d');
        this.addEventListeners()
    }

    addEventListeners = function () {
        //fixes a problem where double clicking causes text to get selected on the canvas
        let { canvas } = this
        canvas.addEventListener('selectstart', function (e) { e.preventDefault(); return false; }, false);
        canvas.addEventListener('mousedown', (e: Object) => { this.mouseDown(e, true) }, true)
        canvas.addEventListener('mousemove', (e: Object) => { this.mouseMove(e, true) }, true)
        canvas.addEventListener('mouseup', (e: Object) => { this.mouseUp(e, true) }, true)
        canvas.addEventListener('dblclick', (e: Object) => { this.doubleClick(e) }, true)

        // mobile
        canvas.addEventListener('touchstart', (e: Object) => {
            if (this.didDoubleTap()) {
                e.preventDefault()
                e.stopPropagation()
                this.doubleClick(e)
            } else {
                this.mouseDown(e)
            }

            this.mouseDown(e)

        }, true)
        canvas.addEventListener('touchmove', (e: Object) => {
            this.mouseMove(e, false)
        }, true)
        canvas.addEventListener('touchend', (e: Object) => { this.mouseUp(e) }, true)

    }

    getMouse = function (e) {
        var element = this.canvas,
            offsetX = 0,
            offsetY = 0,
            mx,
            my,
            pageX = 40,
            pageY = 40

        // Compute the total offset
        // this computes the offset from all parent objects (eg. headers, sidebars, containers)
        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
                element = element.offsetParent
            } while (element);
        }

        // uses the appropriate input (mouse or touch) and the appropriate possition (clientX for a fixed element and pageX for a non fixed one)
        if (e.touches && e.touches.length > 0) {
            if (this.isFixed) {
                pageX = e.touches[0].clientX;
                pageY = e.touches[0].clientY;
            } else {
                pageX = e.touches[0].pageX;
                pageY = e.touches[0].pageY;
            }
        } else {
            if (this.isFixed) {
                pageX = e.clientX;
                pageY = e.clientY;
            } else {
                pageX = e.pageX;
                pageY = e.pageY;
            }
        }

        // alert('hi' + pageX + ' ' + pageY)
        mx = pageX - offsetX;
        my = pageY - offsetY;

        // account for if the canvas was scaled
        // notice how we are multiplying by the inverse of the scale factor
        // this will actually make the mouses x and y bigger when the image is scalled smaller
        // the reason as to why we do this is because our faces array must keep its values relative
        // to the size of the original image. When we shrink the canvas using css our mouse position will
        // end up being smaller than what it should compared to where the positions of the faces are.
        // eg. if there is a face at pixel (2,2) and we resize the canvas to half of its original size
        // then when we click on that same face we are actually clicking on pixel (1,1). When we then use
        // Face.contains() we will be checking if pixel (2, 2) contains (1, 1), this will return false event
        // though we did click on the face. so we resize the mouse point up to compensate.
        mx /= this.scaleFactor.x
        my /= this.scaleFactor.y

        // We return a simple javascript object (a hash) with x and y defined
        return { x: mx, y: my };
    }

}