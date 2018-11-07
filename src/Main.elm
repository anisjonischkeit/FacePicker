port module Main exposing (main)

import Debug
import Html
import Html.Events exposing (onClick)
import Json.Decode as Json
import Maybe exposing (Maybe(..))
-- import Mouse -- replace use of mouse
import Svg exposing (Svg)
import Svg.Attributes exposing (..)
import Svg.Events as SvgEvents
import Task
import Translations exposing (..)
import VirtualDom
-- import Window -- replace use of window


main : Program Flags Model Msg
main =
    Html.programWithFlags
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



------------------------------------------------------------------
-- CONSTANTS
------------------------------------------------------------------


marginScene =
    0



------------------------------------------------------------------
-- MODEL
------------------------------------------------------------------


type PossibleDownOn
    = LeftEye Position
    | RightEye Position
    | Face Position


type MouseState
    = Down
    | DownOn PossibleDownOn
    | Up


type alias Faces =
    List Eyes


type alias SizeWithMaybes =
    { width : Maybe Int
    , height : Maybe Int
    }


type alias Model =
    { size : Window.Size
    , maxSize : SizeWithMaybes
    , mousePos : Position
    , mouseState : MouseState
    , imgSize : Maybe Window.Size
    , faceSelection : Maybe Int
    , faces : Faces
    , imgUrl : String
    }


type alias Flags =
    { selection : Maybe Int
    , faces : Faces
    , imgUrl : String
    , maxSize : SizeWithMaybes
    }


init : Flags -> ( Model, Cmd Msg )
init { selection, faces, imgUrl, maxSize } =
    ( { size = Window.Size 600 600
      , maxSize = maxSize
      , mousePos = Position 0 0
      , mouseState = Up
      , faceSelection = selection
      , imgSize = Nothing
      , faces = faces
      , imgUrl = imgUrl
      }
    , Cmd.batch
        [ Task.perform WindowSize Window.size
        , getDim imgUrl
        ]
    )



------------------------------------------------------------------
-- UPDATE
------------------------------------------------------------------


type Msg
    = WindowSize Window.Size
    | MouseMove Position Position
    | MouseDown
    | MouseDownOnFace Int Position
    | MouseMoveOnFace Position Position
    | MouseDownOnLeftEye Int Position
    | MouseMoveOnLeftEye Position Position
    | MouseDownOnRightEye Int Position
    | MouseMoveOnRightEye Position Position
    | MouseUp Mouse.Position
    | UpdateDim Window.Size
    | UpdateMaxSize SizeWithMaybes
    | UpdateStateFromPort ( Faces, Maybe Int, String, Window.Size )
    | UpdateFacesFromPort ( Faces, Maybe Int )
    | AddFace
    | DeleteCurrentFace


newFaceEyes : Eyes -> Position -> Position -> Eyes
newFaceEyes oldEyes leftEyeShift rightEyeShift =
    let
        leftEye =
            addPos oldEyes.left leftEyeShift

        --Position (oldEyes.left.x + diff.x) (oldEyes.left.y + diff.y)
        rightEye =
            addPos oldEyes.right rightEyeShift
    in
    Eyes leftEye rightEye


updateFace selection leftEyeShift rightEyeShift idx face =
    if idx == selection then
        newFaceEyes face leftEyeShift rightEyeShift

    else
        face


getNewFaces faces selection leftEyeShift rightEyeShift =
    case selection of
        Just sel ->
            List.indexedMap (updateFace sel leftEyeShift rightEyeShift) faces

        Nothing ->
            faces


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        WindowSize { width, height } ->
            ( { model | size = Window.Size (width - 2 * marginScene) (height - 100 - 2 * marginScene) }, Cmd.none )

        {-
           This event is triggered whenever the mouse moves. This
           could be because when over an object or on the background
        -}
        MouseMove faceOffset absoluteMousePos ->
            case model.mouseState of
                DownOn downedObj ->
                    let
                        scaleFactor =
                            getScaleFactor model

                        shift =
                            subtractPos absoluteMousePos model.mousePos
                                |> (\a -> dividePos a (Position scaleFactor scaleFactor))

                        updateEyes lShift rShift =
                            ( { model
                                | faces = getNewFaces model.faces model.faceSelection lShift rShift
                                , mousePos = absoluteMousePos
                              }
                            , Cmd.none
                            )
                    in
                    case downedObj of
                        Face p ->
                            updateEyes shift shift

                        LeftEye _ ->
                            updateEyes shift (Position 0 0)

                        RightEye _ ->
                            updateEyes (Position 0 0) shift

                Up ->
                    ( { model | mousePos = absoluteMousePos }, Cmd.none )

                Down ->
                    ( { model | mousePos = absoluteMousePos }, Cmd.none )

        UpdateMaxSize maxSize ->
            ( { model | maxSize = maxSize }, Cmd.none )

        UpdateDim imgSize ->
            ( { model | imgSize = Just imgSize }, Cmd.none )

        UpdateFacesFromPort ( faces, selection ) ->
            ( { model | faces = faces, faceSelection = selection }, Cmd.none )

        UpdateStateFromPort ( faces, selection, imgUrl, imgSize ) ->
            ( { model | faces = faces, faceSelection = selection, imgUrl = imgUrl, imgSize = Just imgSize }, Cmd.none )

        MouseDown ->
            ( { model | mouseState = Down, faceSelection = Nothing }, Cmd.none )

        MouseDownOnFace idx pos ->
            ( { model | faceSelection = Just idx, mouseState = DownOn (Face pos) }, Cmd.none )

        {-
           This is only triggered when the mouse is not down
           Pointer events are off on faces when the mouse is down
        -}
        MouseMoveOnFace offset pos ->
            let
                -- scaleFac = getScaleFactor model
                -- scale = flip dividePos <| Position scaleFac scaleFac
                -- _ = Debug.log "off" offset
                -- _ = Debug.log "pos" pos
                absolutePos =
                    addPos offset pos

                -- absolutePos if no clipped overlay
                -- pos if clipped overlay
            in
            ( { model | mousePos = pos }, Cmd.none )

        MouseDownOnLeftEye idx pos ->
            ( { model | faceSelection = Just idx, mouseState = DownOn (LeftEye pos) }, Cmd.none )

        MouseMoveOnLeftEye offset pos ->
            -- absolutePos if no clipped overlay
            -- pos if clipped overlay
            let
                absolutePos =
                    addPos offset pos
            in
            ( { model | mousePos = pos }, Cmd.none )

        MouseDownOnRightEye idx pos ->
            ( { model | faceSelection = Just idx, mouseState = DownOn (RightEye pos) }, Cmd.none )

        MouseMoveOnRightEye offset pos ->
            -- absolutePos if no clipped overlay
            -- pos if clipped overlay
            let
                absolutePos =
                    addPos offset pos
            in
            ( { model | mousePos = pos }, Cmd.none )

        MouseUp pos ->
            ( { model | mouseState = Up }, facesChanged ( model.faces, model.faceSelection ) )

        AddFace ->
            let
                newFace =
                    Eyes (Position (((toFloat <| List.length model.faces) * 70) + 75) 50) (Position ((toFloat <| List.length model.faces * 70) + 100) 50)
            in
            ( { model | faces = model.faces ++ [ newFace ] }, Cmd.none )

        DeleteCurrentFace ->
            case model.faceSelection of
                Just i ->
                    let
                        deleteAtIndex i xs =
                            List.take i xs ++ List.drop (i + 1) xs

                        newFaces =
                            deleteAtIndex i model.faces
                    in
                    ( { model | faces = newFaces, faceSelection = Nothing }, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )



------------------------------------------------------------------
-- VIEW
------------------------------------------------------------------


view : Model -> Html.Html Msg
view model =
    Html.div []
        [ scene model
        , Html.button [ onClick AddFace ] [ Html.text "add face" ]
        , Html.button [ onClick DeleteCurrentFace ] [ Html.text "delete face" ]
        ]


scene : Model -> Html.Html Msg
scene model =
    case model.imgSize of
        Just imgSize ->
            let
                scale =
                    getScaleFactor model

                size =
                    { width = round <| toFloat imgSize.width * scale
                    , height = round <| toFloat imgSize.height * scale
                    }

                svgFaces =
                    createSvgFaces model
            in
            Svg.svg
                [ width <| toString size.width
                , height <| toString size.height
                , style ("margin-left:" ++ px marginScene)
                ]
                ([ background model
                 , bgImg model.imgUrl { height = size.height, width = size.width } -- size
                 , clippedBgImg model.imgUrl { height = size.height, width = size.width } -- size

                 -- CLIPPED SVG FACES ADDS SOMETHING THAT MAKES THE POSITIONS GO OFF ON MOUSEMOVEOVERFACE
                 , createSvgClippedFaces <|
                    svgFaces
                 ]
                    ++ svgFaces
                )

        Nothing ->
            Html.p [] [ Html.text "loading" ]


createSvgClippedFaces : List (Svg.Svg Msg) -> Svg Msg
createSvgClippedFaces thingsToClip =
    Svg.clipPath [ id "clipCircles" ] thingsToClip


createSvgFaces : Model -> List (Svg.Svg Msg)
createSvgFaces model =
    let
        attachScaleFactor =
            createSvgFace <|
                getScaleFactor model

        attachCaptureEvents =
            case model.mouseState of
                DownOn _ ->
                    attachScaleFactor False

                _ ->
                    attachScaleFactor True

        attachIsSelected idx =
            case model.faceSelection of
                Just sel ->
                    attachCaptureEvents (idx == sel) idx

                Nothing ->
                    attachCaptureEvents False idx

        listOfLists =
            List.indexedMap attachIsSelected model.faces
    in
    List.foldr (++) [] listOfLists


bgImg : String -> Window.Size -> Svg.Svg Msg
bgImg imgUrl imgSize =
    Svg.image
        [ x "0"
        , y "0"
        , style "-webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -o-user-select: none; user-select: none;-ms-user-drag:none; -moz-user-drag:none; user-drag:none; -webkit-user-drag:none;opacity:0.6;"
        , width <| toString imgSize.width
        , height <| toString imgSize.height
        , xlinkHref imgUrl
        , SvgEvents.onMouseDown MouseDown
        , VirtualDom.onWithOptions "mousemove" options (Json.map (MouseMove (Position 0 0)) offsetPositionWDefault)

        -- , VirtualDom.onWithOptions "mousedown" options (Json.map (MouseMove (Position 0 0)) offsetPositionWDefault)
        ]
        []


clippedBgImg : String -> Window.Size -> Svg.Svg Msg
clippedBgImg imgUrl imgSize =
    Svg.image
        [ x "0"
        , y "0"
        , style "-webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -o-user-select: none; user-select: none;-ms-user-drag:none; -moz-user-drag:none; user-drag:none; -webkit-user-drag:none;"
        , width <| toString imgSize.width
        , height <| toString imgSize.height
        , Svg.Attributes.clipPath "url(#clipCircles)"
        , xlinkHref imgUrl
        , SvgEvents.onMouseDown MouseDown
        , VirtualDom.onWithOptions "mousemove" options (Json.map (MouseMove (Position 0 0)) offsetPositionWDefault)

        -- , VirtualDom.onWithOptions "mousedown" options (Json.map (MouseMove (Position 0 0)) offsetPositionWDefault)
        ]
        []


background : Model -> Svg.Svg Msg
background model =
    Svg.rect
        [ width <| toString <| model.size.width
        , height <| toString <| model.size.height
        , fill "black"
        ]
        []



------------------------------------------------------------------
-- SUBSCRPTIONS
------------------------------------------------------------------


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ newContainerSize UpdateMaxSize

        -- Window.resizes WindowSize
        , newDim UpdateDim
        , newFaces UpdateFacesFromPort
        , newState UpdateStateFromPort

        -- , Mouse.downs MouseDown
        , Mouse.ups MouseUp
        ]


port newDim : (Window.Size -> msg) -> Sub msg


port newFaces : (( Faces, Maybe Int ) -> msg) -> Sub msg


port newState : (( Faces, Maybe Int, String, Window.Size ) -> msg) -> Sub msg


port newContainerSize : (SizeWithMaybes -> msg) -> Sub msg


port facesChanged : ( Faces, Maybe Int ) -> Cmd msg


port getDim : String -> Cmd msg



------------------------------------------------------------------
-- TRANSLATION FUNCS
------------------------------------------------------------------


getActualElementSize model =
    let
        width =
            case model.maxSize.width of
                Just a ->
                    Basics.min a model.size.width

                Nothing ->
                    model.size.width

        height =
            case model.maxSize.height of
                Just a ->
                    Basics.min a model.size.height

                Nothing ->
                    model.size.height
    in
    Window.Size width height


getScaleFactor : Model -> Float
getScaleFactor model =
    case model.imgSize of
        Just imgSize ->
            scaleFactor imgSize <|
                getActualElementSize model

        Nothing ->
            1


px : a -> String
px n =
    toString n ++ "px"


{-| These options are an attempt to prevent double- and triple-clicking from
propagating and selecting text outside the SVG scene. Doesn't work.
-}
options =
    { preventDefault = True, stopPropagation = True }



-- offsetPosition : Json.Decoder Position


offsetPositionWDefault =
    offsetPosition


offsetPosition : Json.Decoder Position
offsetPosition =
    Json.map2 Position (Json.field "layerX" Json.float) (Json.field "layerY" Json.float)



-- ------------------------------------------------------------------
-- -- SVG FUNCS
-- ------------------------------------------------------------------


createSvgFace : Float -> Bool -> Bool -> Int -> Eyes -> List (Svg Msg)
createSvgFace scaleFactor captureEvents isSelected idx realEyes =
    let
        -- _ = Debug.log "scaleFac" scaleFactor
        scale =
            \a -> multiplyPos a (Position scaleFactor scaleFactor)

        eyes =
            { left = scale realEyes.left
            , right = scale realEyes.right
            }

        -- _ = Debug.log "eyes" eyes
        screenFaceCentre =
            faceCentreFromEyes eyes

        -- screenFaceCentre = faceCentreFromEyes realEyes
        radius =
            radiusFromEyes eyes

        faceOffset =
            subtractPos screenFaceCentre <|
                Position radius radius

        leftEyeOffset =
            subtractPos eyes.left <|
                Position 8 8

        rightEyeOffset =
            subtractPos eyes.right <|
                Position 8 8

        baseStyle =
            "stroke-width:2;fill:#044B94;fill-opacity:0;"

        styleWithEventControl =
            if captureEvents then
                baseStyle ++ "pointer-events:auto;"

            else
                baseStyle ++ "pointer-events:none;"

        fullStyle =
            if isSelected then
                styleWithEventControl ++ "stroke:#7fd13b;"

            else
                styleWithEventControl ++ "stroke:#000;"
    in
    [ Svg.circle
        -- Outer Circle
        [ cx <| toString screenFaceCentre.x
        , cy <| toString screenFaceCentre.y
        , r <| toString <| radiusFromEyes eyes
        , style fullStyle
        , VirtualDom.onWithOptions "mousemove" options <|
            Json.map (MouseMoveOnFace faceOffset) offsetPosition

        -- , VirtualDom.onWithOptions "touchmove" options
        --     <| Json.map (MouseMoveOnFace faceOffset) offsetPosition
        , VirtualDom.onWithOptions "mousedown" options <|
            Json.map (MouseDownOnFace idx) offsetPosition
        ]
        []
    , Svg.circle
        -- Left Eye
        [ cx <| toString eyes.left.x
        , cy <| toString eyes.left.y
        , r "8px"
        , style fullStyle
        , VirtualDom.onWithOptions "mousemove" options (Json.map (MouseMoveOnLeftEye leftEyeOffset) offsetPosition)
        , VirtualDom.onWithOptions "mousedown" options (Json.map (MouseDownOnLeftEye idx) offsetPosition)
        ]
        []
    , Svg.circle
        -- Right Eye
        [ cx <| toString eyes.right.x
        , cy <| toString eyes.right.y
        , r "8px"
        , style fullStyle
        , VirtualDom.onWithOptions "mousemove" options (Json.map (MouseMoveOnRightEye rightEyeOffset) offsetPosition)
        , VirtualDom.onWithOptions "mousedown" options (Json.map (MouseDownOnRightEye idx) offsetPosition)
        ]
        []
    ]
