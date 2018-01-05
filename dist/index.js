module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _CanvasState = __webpack_require__(3);

var _CanvasState2 = _interopRequireDefault(_CanvasState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var imgFromUrl = function imgFromUrl(url, cb) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        cb(img);
    };
};

var imgFromFile = function imgFromFile(file, cb) {
    imgFromUrl(URL.createObjectURL(file), cb);
};

var getImageElementFromProps = function getImageElementFromProps(props, cb) {
    var done = false;
    var errorMsg = "you can only specify one of (imgUrl imgElement imgFile) in ImagusFacePicker";
    if (props.imgUrl) {
        done = true;
        imgFromUrl(props.imgUrl, cb);
    }
    if (props.imgElement) {
        if (done) {
            console.error(errorMsg);
            throw errorMsg;
        }
        done = true;
        cb(props.imgElement);
    }
    if (props.imgFile) {
        if (done) {
            console.error(errorMsg);
            throw errorMsg;
        }
        imgFromFile(props.imgFile, cb);
    }
};

function bindFirstArg(fn, a) {
    return function (b) {
        return fn(a, b);
    };
}

var Canvas = function (_Component) {
    _inherits(Canvas, _Component);

    function Canvas() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Canvas);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Canvas.__proto__ || Object.getPrototypeOf(Canvas)).call.apply(_ref, [this].concat(args))), _this), _this.canvas = null, _this.canvasState = null, _this.setFacesInCanvasState = function (props) {
            if (_this.canvasState == null) {
                throw "setFacesInCanvasState should only be called once a CanvasState has been created";
            }
            _this.canvasState.clearFaces();
            props.faces && props.faces.forEach(function (face, idx) {
                var selected = false;
                if (idx === props.selected) {
                    selected = true;
                }
                _this.canvasState.addFace(face, selected);
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Canvas, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            getImageElementFromProps(this.props, function (img) {
                _this2.canvasState = new _CanvasState2.default(_this2.canvas, _this2.props.onFacesUpdate, img);
                _this2.setFacesInCanvasState(_this2.props);
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            getImageElementFromProps(this.props, bindFirstArg(this.setFacesInCanvasState, props));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            // console.log("state.faces = ")
            // console.log(this.state.faces)
            return _react2.default.createElement('canvas', {
                width: 500,
                height: 500,
                ref: function ref(r) {
                    _this3.canvas = r;
                }
            });
        }
    }]);

    return Canvas;
}(_react.Component);

exports.default = Canvas;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _ImagusCanvas = __webpack_require__(1);

var _ImagusCanvas2 = _interopRequireDefault(_ImagusCanvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ImagusCanvas2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Face = __webpack_require__(4);

var _Face2 = _interopRequireDefault(_Face);

var _translations = __webpack_require__(5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

var myState = null;

var CanvasState = function CanvasState(canvas, updateFaces, bgImage) {
    _classCallCheck(this, CanvasState);

    _initialiseProps.call(this);

    this.canvas = canvas;
    this.bgImage = bgImage;
    this.bgImage.width = canvas.width;
    this.bgImage.height = canvas.height;
    this.updateFaces = updateFaces;

    this.width = canvas.width;
    this.height = canvas.height;

    this.ctx = canvas.getContext('2d');

    //used for getting an accurate mouse position when an image is resized
    this.scaleFactor = {
        x: canvas.clientWidth / this.width,
        y: canvas.clientHeight / this.height
    };

    this.valid = false; // when set to false, the canvas will redraw everything
    this.faces = []; // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    this.draggingEye = false; // Keep track of when we are dragging
    this.onSquare = false; // Keeps track of when we are on the resize corner
    this.rotating = false; // Keeps track of when we are on the rotation handle
    this.direction = null; // Direction in which we are resizing
    this.mouseMoved = false; // Tests if the mouse has moved (needed to determine if a mobile user tappped or swiped)
    this.justSelected = false; // tests if a face was selected on the last mousedown event (mobile ^)
    this.lastTapTime = 0; // used to check if we double tapped
    this.doubleClickTimer = null; // timer used to do a single click instead of a double click

    this.currentCursor = 'default';

    this.selection = null; // The index of the selected face in our faces array
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;
    this.isTouchDevice = false;

    if (isTouchDevice()) {
        this.isTouchDevice = true;
    }

    // **** Options! ****

    this.toolColor = '#AAA'; // the color which our resize and rotate tools will be
    this.toolLineWidth = 2; // the linewidth which our resize and rotate tools will have
    this.interval = 30; // how often the screen redraws
    this.rotateLine = 12; // the length of the rotation handle line
    this.rotateRad = 8; // the length of the rotation handle

    this.eyeGrabRegionRadius = 12;
    this.shiftedEyeHandleLength = 25;
    this.shiftedEyeHandleRadius = 16;

    if (window.innerWidth < canvas.width) {
        this.eyeGrabRegionRadius *= canvas.width / window.innerWidth;
        this.shiftedEyeHandleLength *= canvas.width / window.innerWidth;
        this.shiftedEyeHandleRadius *= canvas.width / window.innerWidth;
        this.rotateRad *= canvas.width / window.innerWidth; // the length of the rotation handle
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
        };
    }.bind(this);

    this.addEventListeners();

    setInterval(function () {
        myState.draw();
    }, myState.interval);
}

// reset all dragging states since we nolonger have anything selected with the mouse


// double click for creating and deleting new shapes


// add a face and unless we explicitly say don't select it, it should be selected
// then redraw


//clears the canvas


// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code


// this function is used to set the canvas element if it was unset
;

var _initialiseProps = function _initialiseProps() {
    var _this = this;

    this.mouseDown = function (e, isMouse) {
        var mouse = myState.getMouse(e);

        var mx = mouse.x;
        var my = mouse.y;
        var faces = myState.faces;
        var l = faces.length;
        var mySel;

        // alert(mx + ' ' + my)


        // tests to see if an eye has been selected
        var insideEye;
        if (myState.selection !== null) {
            if (this.isTouchDevice) {
                insideEye = faces[myState.selection].eyeContains(mx, my, this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius + this.eyeGrabRegionRadius, this.shiftedEyeHandleRadius);
            } else {
                insideEye = faces[myState.selection].eyeContains(mx, my);
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
            return;
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
                    myState.direction = 'TL';
                    mx += (mySel.centre.x - mx) * 2;
                    my += (mySel.centre.y - my) * 2;
                } else {
                    //bottom left
                    myState.direction = 'BL';
                    mx += (mySel.centre.x - mx) * 2;
                }
            } else {
                // right off the box
                //top right
                if (mouse.y < faces[myState.selection].centre.y) {
                    myState.direction = 'TR';
                    my += (mySel.centre.y - my) * 2;
                } else {
                    //bottom right
                    myState.direction = 'BR';
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
                myState.justSelected = true;
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

    this.mouseMove = function (e, isMouse) {
        myState.mouseMoved = true;
        if (myState.dragging) {
            e.preventDefault();
            var mouse = myState.getMouse(e);

            if (myState.draggingEye) {
                var face = myState.faces[myState.selection];
                if (myState.draggingEye === 'left') {
                    face.eyes.left.x = mouse.x - myState.dragoffx;
                    face.eyes.left.y = mouse.y - myState.dragoffy;
                } else if (myState.draggingEye === 'right') {
                    face.eyes.right.x = mouse.x - myState.dragoffx;
                    face.eyes.right.y = mouse.y - myState.dragoffy;
                }
                face.updateFaceOnEyesChange();
            }

            // if the outside square was selected, resize the image
            else if (myState.onSquare) {
                    var _face = myState.faces[myState.selection],
                        startX = _face.centre.x - _face.radius - myState.dragoffx,
                        // the top most and left most points of our face
                    startY = _face.centre.y - _face.radius - myState.dragoffy,
                        endX = _face.centre.x + _face.radius + myState.dragoffx,
                        // the bottom most and right most points of our face
                    endY = _face.centre.y + _face.radius + myState.dragoffy;

                    var scaleFactor;
                    switch (myState.direction) {
                        case 'TR':
                            scaleFactor = Math.max(startY - mouse.y, mouse.x - endX);
                            break;

                        case 'TL':
                            scaleFactor = Math.max(startY - mouse.y, startX - mouse.x);
                            break;

                        case 'BR':
                            scaleFactor = Math.max(mouse.x - endX, mouse.y - endY);
                            break;

                        case 'BL':
                            scaleFactor = Math.max(mouse.y - endY, startX - mouse.x);
                            break;

                        default:
                            // do nothing
                            break;
                    }

                    _face.radius += scaleFactor;
                    _face.eyes = (0, _translations.getEyes)(_face.centre, _face.radius * 2, _face.rotation);
                    _face.getEyes();

                    // if the rotate handle was selected then we should rotate the face
                } else if (myState.rotating) {
                    var mySel = myState.faces[myState.selection];

                    // Get the angle at which the mouse is from the centre
                    // The angles that tan gives us is between 0 and PI so we only get half of the circle
                    // NOTE: PI/2 needs to be added in both cases to adjust for the starting position of the rotation handle
                    // being at the top of the face rather than at the side (where 0 Radians would be)
                    if (mouse.y < mySel.centre.y) {
                        // if the mouse is positioned above the centre of the object then we take the tan value
                        mySel.rotation = Math.PI / 2 + Math.atan((mouse.x - mySel.centre.x) / (mySel.centre.y - mouse.y));
                    } else {
                        // if the mouse is positioned below the centre of the object then we add PI to the value to get the other side of the circle
                        mySel.rotation = Math.PI + Math.PI / 2 + Math.atan((mouse.x - mySel.centre.x) / (mySel.centre.y - mouse.y));
                    }

                    mySel.getEyes();
                } else {
                    // if we weren't rotating or resizing but we are dragging then we must be moving the object

                    // eye positions relative to the centre before the centre gets changed
                    // we need to keep track of this so that we can we can calculate where
                    // the eyes should end up
                    var relativeEyePos = {
                        left: {
                            x: myState.faces[myState.selection].centre.x - myState.faces[myState.selection].eyes.left.x,
                            y: myState.faces[myState.selection].eyes.left.y - myState.faces[myState.selection].centre.y
                        },
                        right: {
                            x: myState.faces[myState.selection].eyes.right.x - myState.faces[myState.selection].centre.x,
                            y: myState.faces[myState.selection].eyes.right.y - myState.faces[myState.selection].centre.y
                        }

                        // We don't want to drag the object from the centre, we want to drag it
                        // from where we clicked. Thats why we saved the offset and use it here

                        //set new centre points for the current face
                    };myState.faces[myState.selection].centre.x = mouse.x - myState.dragoffx;
                    myState.faces[myState.selection].centre.y = mouse.y - myState.dragoffy;

                    //set the new eye positions
                    myState.faces[myState.selection].eyes.left.x = myState.faces[myState.selection].centre.x - relativeEyePos.left.x;
                    myState.faces[myState.selection].eyes.left.y = myState.faces[myState.selection].centre.y + relativeEyePos.left.y;
                    myState.faces[myState.selection].eyes.right.x = myState.faces[myState.selection].centre.x + relativeEyePos.right.x;
                    myState.faces[myState.selection].eyes.right.y = myState.faces[myState.selection].centre.y + relativeEyePos.right.y;
                }

            myState.valid = false; // Something's being dragged so we must redraw
        } else if (isMouse) {
            var _mouse = myState.getMouse(e);
            var newCursor;

            for (var i = 0; i < myState.faces.length; i++) {
                var _face2 = myState.faces[i];
                if (_face2.contains(_mouse.x, _mouse.y)) {
                    newCursor = 'pointer';
                    break;
                }
            }
            if (myState.selection != null) {
                var _face3 = void 0;
                _face3 = myState.faces[myState.selection];
                if (_face3.eyeContains(_mouse.x, _mouse.y) || this.isTouchDevice && _face3.eyeContains(_mouse.x, _mouse.y, this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius + this.eyeGrabRegionRadius, this.shiftedEyeHandleRadius) || _face3.dragHandleContains(_mouse.x, _mouse.y, myState.rotateLine, myState.rotateRad)) {
                    newCursor = 'pointer';
                } else if (_face3.contains(_mouse.x, _mouse.y)) {
                    newCursor = 'move';
                } else if (_face3.cornerContains(_mouse.x, _mouse.y)) {
                    if (_face3.centre.x < _mouse.x) {
                        // mouse is to the right
                        if (_face3.centre.y < _mouse.y) {
                            // bottom right
                            newCursor = 'nw-resize';
                        } else {
                            // top right
                            newCursor = 'ne-resize';
                        }
                    } else {
                        if (_face3.centre.y < _mouse.y) {
                            // bottom left
                            newCursor = 'ne-resize';
                        } else {
                            // top left
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

    this.getReturnableFaces = function () {
        return myState.faces.map(function (face) {
            return {
                eyes: face.eyes
            };
        });
    };

    this.mouseUp = function (e, isMouse) {
        if (!isMouse && !myState.mouseMoved && !myState.justSelected && myState.selection !== null) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
        myState.justSelected = false;
        myState.mouseMoved = false;
        myState.dragging = false;
        myState.draggingEye = false;
        myState.onSquare = false;
        myState.rotating = false;

        myState.updateFaces(this.getReturnableFaces(), myState.selection);
    };

    this.didDoubleTap = function () {

        var now = new Date().getTime();
        var timesince = now - myState.lastTapTime;

        myState.lastTapTime = now;
        if (timesince < 250 && timesince > 100) {
            // double tap
            return true;
        } else {
            // too much time to be a doubletap
            return false;
        }
    };

    this.doubleClick = function (e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var faces = myState.faces;
        var l = faces.length;
        var onFace = false;

        // if there is a face in the location of the mouse then remove that face from our faces array and redraw
        for (var i = l - 1; i >= 0; i--) {
            if (faces[i].contains(mx, my)) {
                myState.faces.splice(i, 1);
                myState.selection = null;
                myState.valid = false;
                onFace = true;
                break;
            }
        }

        if (!onFace) {
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
            });
        }
    };

    this.addFace = function (face, selected) {
        var faceObj = _extends({}, face);
        faceObj.centre = (0, _translations.faceCentreFromEyes)(face.eyes);
        faceObj.radius = (0, _translations.radiusFromEyes)(face.eyes);

        this.faces.push(new _Face2.default(faceObj));
        if (selected !== false) this.selection = this.faces.length - 1;

        this.valid = false;
    };

    this.clearFaces = function () {
        return myState.faces = [];
    };

    this.clear = function () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    this.setBgImg = function (img) {
        myState.bgImage = img;
        myState.valid = false;
    };

    this.draw = function () {

        // if our state is invalid, redraw and validate!
        if (!this.valid) {
            var ctx = this.ctx;
            var faces = this.faces;
            this.clear();

            // load background image first so that everything else gets played ontop of it
            if (this.bgImage) {
                this.ctx.drawImage(this.bgImage, 0, 0, this.width, this.height);
            }

            // draw all shapes
            var l = faces.length;
            for (var i = 0; i < l; i++) {
                var face = faces[i];
                // We can skip the drawing of elements that have moved off the screen:
                if (face.centre.x - face.radius > this.width || face.centre.y - face.radius > this.height || face.centre.x + face.radius < 0 || face.centre.y + face.radius < 0) continue;

                // if the current face is the selected face, draw tools around it (resize and rotate)
                if (this.selection != null && this.selection === i) {
                    face.draw(ctx, true);
                    ctx.strokeStyle = this.toolColor;
                    ctx.lineWidth = this.toolLineWidth;

                    // draws the resize box
                    ctx.save();
                    ctx.translate(face.centre.x, face.centre.y);

                    // ctx rotate will rotate the resize box to the correct rotation however,
                    // Face.cornerContains needs to be modified to accomodate for the rotation
                    // so this feature hase been commented out
                    // ctx.rotate(face.rotation)

                    ctx.strokeRect(0 - face.radius, 0 - face.radius, face.radius * 2, face.radius * 2);
                    ctx.restore();

                    ctx.strokeStyle = this.toolColor;
                    ctx.fillStyle = this.toolColor;
                    ctx.lineWidth = this.toolLineWidth;

                    // draws the rotate drag handle
                    ctx.save();
                    ctx.translate(face.centre.x, face.centre.y);
                    ctx.rotate(face.rotation);

                    ctx.faceWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(0 - face.radius, 0);
                    ctx.lineTo(0 - face.radius - this.rotateLine, 0);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.lineWidth = this.toolLineWidth + 1;
                    ctx.arc(0 - face.radius - this.rotateLine - this.rotateRad, 0, this.rotateRad, 0, 2 * Math.PI, false);
                    // ctx.fill();
                    ctx.stroke();

                    ctx.restore();

                    //draw handles around eyes
                    ctx.beginPath();
                    ctx.arc(face.eyes.left.x, face.eyes.left.y, this.eyeGrabRegionRadius, 0, 2 * Math.PI, false);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(face.eyes.right.x, face.eyes.right.y, this.eyeGrabRegionRadius, 0, 2 * Math.PI, false);
                    ctx.stroke();

                    if (this.isTouchDevice) {
                        ctx.save();

                        ctx.setLineDash([5, 5]);

                        ctx.beginPath();
                        ctx.moveTo(face.eyes.left.x, face.eyes.left.y + this.eyeGrabRegionRadius);
                        ctx.lineTo(face.eyes.left.x, face.eyes.left.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(face.eyes.left.x, face.eyes.left.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius, this.shiftedEyeHandleRadius, 0, 2 * Math.PI, false);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(face.eyes.right.x, face.eyes.right.y + this.eyeGrabRegionRadius);
                        ctx.lineTo(face.eyes.right.x, face.eyes.right.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength);
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(face.eyes.right.x, face.eyes.right.y + this.eyeGrabRegionRadius + this.shiftedEyeHandleLength + this.shiftedEyeHandleRadius, this.shiftedEyeHandleRadius, 0, 2 * Math.PI, false);
                        ctx.stroke();

                        ctx.restore();
                    }
                } else {
                    // if the current face is not the selected face, just draw it but do not select it
                    face.draw(ctx, false);
                }
            }

            // set the state to valid as everything has been redrawn so it doesn't need to be redrawn again
            this.valid = true;
        }
    };

    this.setCanvasElement = function (canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext('2d');
        this.addEventListeners();
    };

    this.accountForDoubleClick = function (e, isMouse) {
        if (_this.didDoubleTap()) {
            e.preventDefault();
            e.stopPropagation();
            _this.doubleClick(e);
        } else {
            _this.mouseDown(e, isMouse);
        }

        _this.mouseDown(e, isMouse);
    };

    this.addEventListeners = function () {
        var _this2 = this;

        //fixes a problem where double clicking causes text to get selected on the canvas
        var canvas = this.canvas;

        canvas.addEventListener('selectstart', function (e) {
            e.preventDefault();return false;
        }, false);
        canvas.addEventListener('mousemove', function (e) {
            _this2.mouseMove(e, true);
        }, true);
        // canvas.addEventListener('dblclick', (e: Object) => { this.doubleClick(e) }, true)
        canvas.addEventListener('mouseup', function (e) {
            _this2.mouseUp(e, true);
        }, true);

        canvas.addEventListener('mousedown', function (e) {
            // this.mouseDown(e, true) 
            _this2.accountForDoubleClick(e, true);
        }, true);
        // mobile
        canvas.addEventListener('touchstart', function (e) {
            _this2.accountForDoubleClick(e);
        }, true);

        canvas.addEventListener('touchmove', function (e) {
            _this2.mouseMove(e, false);
        }, true);

        canvas.addEventListener('touchend', function (e) {
            _this2.mouseUp(e);
        }, true);
    };

    this.getMouse = function (e) {
        var element = this.canvas,
            offsetX = 0,
            offsetY = 0,
            mx,
            my,
            pageX = 40,
            pageY = 40;

        // Compute the total offset
        // this computes the offset from all parent objects (eg. headers, sidebars, containers)
        if (element.offsetParent !== undefined) {
            do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
                element = element.offsetParent;
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
        mx /= this.scaleFactor.x;
        my /= this.scaleFactor.y;

        // We return a simple javascript object (a hash) with x and y defined
        return { x: mx, y: my };
    };
};

exports.default = CanvasState;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Face = function Face(faceObj) {
    _classCallCheck(this, Face);

    this.getFaceRotation = function () {
        var rise = this.eyes.left.x - this.eyes.right.x;
        var run = this.eyes.left.y - this.eyes.right.y;
        // if(Math.atan(rise/run) > 0){
        return -Math.atan2(rise, run);
        // }
        // return - Math.atan(rise/run)
    };

    this.draw = function (ctx, selected) {

        // the color of a selected face
        var selectionColor = '#3eb049';

        // the current faces defaultColor
        var defaultColor = this.color;

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
        this.ctx = ctx;
        ctx.beginPath();
        ctx.arc(this.eyes.left.x, this.eyes.left.y, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.eyes.right.x, this.eyes.right.y, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();

        // Draw Face
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc(this.centre.x, this.centre.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();

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
    };

    this.contains = function (x, y) {
        return this.circleContains(x, y, this.centre, this.radius);
    };

    this.circleContains = function (x, y, centre, radius) {
        return Math.sqrt((centre.x - x) * (centre.x - x) + (centre.y - y) * (centre.y - y)) < radius;
    };

    this.cornerContains = function (x, y) {

        return (
            // returns true if outside of the circle 
            !this.contains(x, y)

            // returns true if inside of square
            && this.centre.x + this.radius >= x && this.centre.x - this.radius <= x && this.centre.y + this.radius >= y && this.centre.y - this.radius <= y
        );
    };

    this.eyeContains = function (x, y, shiftedHandleLength, shiftedHandleRadius) {
        var eyeRad = 12;

        if (this.circleContains(x, y, this.eyes.left, eyeRad) || shiftedHandleLength && shiftedHandleRadius && this.circleContains(x, y, { x: this.eyes.left.x, y: this.eyes.left.y + shiftedHandleLength }, shiftedHandleRadius)) // (this.eyes.left.x + eyeRad >= x) && (this.eyes.left.x  - eyeRad <= x) && (this.eyes.left.y + eyeRad >= y) && (this.eyes.left.y - eyeRad <= y))
            return 'left';else if (this.circleContains(x, y, this.eyes.right, eyeRad) || shiftedHandleLength && shiftedHandleRadius && this.circleContains(x, y, { x: this.eyes.right.x, y: this.eyes.right.y + shiftedHandleLength }, shiftedHandleRadius)) //(this.eyes.right.x + eyeRad >= x) && (this.eyes.right.x  - eyeRad <= x) && (this.eyes.right.y + eyeRad >= y) && (this.eyes.right.y - eyeRad <= y))
            return 'right';else return false;
    };

    this.dragHandleContains = function (x, y, dragHandleLine, dragHandleRadius) {

        // length of the hypotenuse that we use to calculate the centrepoint of our drag handle
        // this length is the sum of the radius, length of the drag handle line and the radius of the drag handle circle
        var hypotenuse = this.radius + dragHandleLine + dragHandleRadius;

        // calculate the centre of the drag handle
        var dragHandleCentre = {
            x: this.centre.x - Math.cos(this.rotation) * hypotenuse,
            y: this.centre.y - Math.sin(this.rotation) * hypotenuse

            // test if x and y are within the drag handle circle
        };return this.circleContains(x, y, dragHandleCentre, dragHandleRadius);
    };

    this.setFaceCentre = function () {
        var x1 = this.eyes.left.x;
        var y1 = this.eyes.left.y; // First diagonal point
        var x2 = this.eyes.right.x;
        var y2 = this.eyes.right.y; // Second diagonal point


        var xc = (x1 + x2) / 2;
        var yc = (y1 + y2) / 2; // Center point
        var xd = (x1 - x2) / 2;
        var yd = (y1 - y2) / 2; // Half-diagonal


        var x3 = xc + yd;
        var y3 = yc - xd;

        // return th corner of square
        this.centre.y = y3;
        this.centre.x = x3;
    };

    this.getDistBetweenEyes = function () {
        var xDist = this.eyes.left.x - this.eyes.right.x;
        var yDist = this.eyes.left.y - this.eyes.right.y;

        // this.rotation =  - Math.PI - Math.atan(xDist/yDist)
        return Math.sqrt(xDist * xDist + yDist * yDist);
    };

    this.setRadiusFromEyePos = function () {
        this.radius = this.getDistBetweenEyes() * 3 / 2;
    };

    this.updateFaceOnEyesChange = function () {
        this.setFaceCentre();
        this.setRadiusFromEyePos();
        this.rotation = this.getFaceRotation();
    };

    this.getEyes = function () {
        // get the radius (distance) from the centre to the left and right eye
        var eyeRad;
        eyeRad = {
            left: Math.sqrt(Math.pow(this.centre.x - this.eyes.left.x, 2) + Math.pow(this.centre.y - this.eyes.left.y, 2)),
            right: Math.sqrt(Math.pow(this.centre.x - this.eyes.right.x, 2) + Math.pow(this.centre.y - this.eyes.right.y, 2))

            // rotate left eye around the centre using the radius to the left eye and the 
            // rotation angle we got from our mouse position. the offset of Math.PI +/- Math.PI/4 is added
            // to compensate for the eyes being in different positions
        };this.eyes.left.x = this.centre.x + Math.cos(Math.PI - Math.PI / 4 + this.rotation) * eyeRad.left;
        this.eyes.left.y = this.centre.y + Math.sin(Math.PI - Math.PI / 4 + this.rotation) * eyeRad.left;
        this.eyes.right.x = this.centre.x + Math.cos(Math.PI + Math.PI / 4 + this.rotation) * eyeRad.right;
        this.eyes.right.y = this.centre.y + Math.sin(Math.PI + Math.PI / 4 + this.rotation) * eyeRad.right;
    };

    this.eyes = faceObj.eyes;
    this.centre = faceObj.centre;
    this.radius = faceObj.radius;
    this.color = faceObj.color || '#EEE';
    this.rotation = this.getFaceRotation();
}

// used to get the initial rotation of the face based on the eyes


// draws a face object based on its parameters


// returns true if x and y are withing the regions of our face object


// returns true if x and y are within the regions of a given circle 
// (used for checking if x and y are within the regions of a face or the drag handle)


// returns true if x and y are withing the regions of the resize corners that would be on our face


// returns true if x and y are withing the regions of the drag handle
;

exports.default = Face;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var distanceBetweenEyes = exports.distanceBetweenEyes = function distanceBetweenEyes(_ref) {
    var left = _ref.left,
        right = _ref.right;

    var x = Math.abs(left.x - right.x);
    var y = Math.abs(left.y - right.y);

    return Math.sqrt(x * x + y * y);
};

var radiusFromEyes = exports.radiusFromEyes = function radiusFromEyes(eyes) {
    var betweenEyes = distanceBetweenEyes(eyes);
    return betweenEyes + betweenEyes / 2;
};

var faceCentreFromEyes = exports.faceCentreFromEyes = function faceCentreFromEyes(eyes) {
    var x1 = eyes.left.x;
    var y1 = eyes.left.y; // First diagonal point
    var x2 = eyes.right.x;
    var y2 = eyes.right.y; // Second diagonal point


    var xc = (x1 + x2) / 2;
    var yc = (y1 + y2) / 2; // Center point
    var xd = (x1 - x2) / 2;
    var yd = (y1 - y2) / 2; // Half-diagonal
    // console.log(xc)
    // console.log(yc)
    // console.log(xd)
    // console.log(yd)


    var x3 = xc + yd;
    var y3 = yc - xd;

    // return th corner of square
    return {
        x: x3,
        y: y3
    };
};

var rotationFromEyes = exports.rotationFromEyes = function rotationFromEyes(eyes) {
    var run = eyes.left.x - eyes.right.x;
    var rise = eyes.left.y - eyes.right.y;

    return Math.atan2(rise, run) + Math.PI;
};

var relativeEyesFromFace = exports.relativeEyesFromFace = function relativeEyesFromFace(centre, radius) {
    var centreOffset = radius / 3;

    return {
        left: {
            x: -centreOffset,
            y: -centreOffset
        },
        right: {
            x: centreOffset,
            y: -centreOffset

        }
    };
};

var toDegrees = exports.toDegrees = function toDegrees(angle) {
    return angle * (180 / Math.PI);
};

var toRadians = exports.toRadians = function toRadians(angle) {
    return angle * (Math.PI / 180);
};

var rotate = exports.rotate = function rotate(center, rotatee, rads) {
    var rot = {};
    var cosA = Math.cos(rads);
    var sinA = Math.sin(rads);

    rot.x = center.x + cosA * (rotatee.x - center.x) - sinA * (rotatee.y - center.y);
    rot.y = center.y + sinA * (rotatee.x - center.x) + cosA * (rotatee.y - center.y);
    return rot;
};

var getEyes = exports.getEyes = function getEyes(center, size, angle) {
    // console.log(centre, size, angle)

    var eyes = {
        left: {},
        right: {}
        // set eye pos assuming angle of zero...
    };eyes.left.x = center.x - size / 6.0;
    eyes.right.x = center.x + size / 6.0;
    eyes.left.y = center.y - size / 6.0;
    eyes.right.y = center.y - size / 6.0;

    var rads = angle * Math.PI / 180.0;

    eyes.left = rotate(center, eyes.left, rads);
    eyes.right = rotate(center, eyes.right, rads);

    return eyes;
};

/***/ })
/******/ ]);