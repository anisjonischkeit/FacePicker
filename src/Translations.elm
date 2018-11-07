module Translations exposing (Eyes, Position, addPos, distanceBetweenEyes, dividePos, faceCentreFromEyes, multiplyPos, radiusFromEyes, scaleFactor, subtractPos, xyFromEyes)

-- import Window exposing (Size) -- todo replace use of window module


scaleFactor : Size -> Size -> Float
scaleFactor item container =
    min (toFloat container.width / toFloat item.width)
        (toFloat container.height / toFloat item.height)



------------------------------------------------------------------
-- FACE TRANSLATION FUNCS
------------------------------------------------------------------


type alias Position =
    { x : Float, y : Float }


subtractPos : Position -> Position -> Position
subtractPos a b =
    Position (a.x - b.x) (a.y - b.y)


addPos : Position -> Position -> Position
addPos a b =
    Position (a.x + b.x) (a.y + b.y)


multiplyPos : Position -> Position -> Position
multiplyPos a b =
    Position (a.x * b.x) (a.y * b.y)


dividePos : Position -> Position -> Position
dividePos a b =
    Position (a.x / b.x) (a.y / b.y)


type alias Eyes =
    { left : Position
    , right : Position
    }


distanceBetweenEyes : Eyes -> Float
distanceBetweenEyes { left, right } =
    let
        x =
            abs (left.x - right.x)

        y =
            abs (left.y - right.y)
    in
    sqrt <| x ^ 2 + y ^ 2


radiusFromEyes : Eyes -> Float
radiusFromEyes eyes =
    let
        betweenEyes =
            distanceBetweenEyes eyes
    in
    betweenEyes + (betweenEyes / 2)


faceCentreFromEyes : Eyes -> Position
faceCentreFromEyes { left, right } =
    let
        xc =
            (left.x + right.x) / 2

        yc =
            (left.y + right.y) / 2

        -- Center point
        xd =
            (left.x - right.x) / 2

        yd =
            (left.y - right.y) / 2

        -- Half-diagonal
        x3 =
            xc + yd

        y3 =
            yc - xd
    in
    Position x3 y3


xyFromEyes : Eyes -> Position
xyFromEyes eyes =
    let
        radius =
            radiusFromEyes eyes

        centre =
            faceCentreFromEyes eyes

        x =
            centre.x - radius

        y =
            centre.y - radius
    in
    centre



--Position x y
