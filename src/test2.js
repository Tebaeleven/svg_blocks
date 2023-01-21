// SVG.jsの初期化
var draw = SVG('svg')

var rec = draw.svg('<svg id="rect" x="0" y="0" > <g g transform = "scale(1)" > <rect  x="10" y="10" width="50" height="30" rx="10" ry="10" fill="#e74c3c" stroke="red" stroke-width="5" /> <foreignObject x="20" y="12" width="30" height="150"> <input type="text" id="input-size" value="100" style="background-color:transparent;border: none; outline: none;"> </foreignObject> </g > </svg > ')
rec.animate().move(10, 0).during(1000)
