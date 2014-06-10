function loadBackground() {

    var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        paper = new Raphael("background", windowWidth - 5, windowHeight - 5);


    paper.image('imgs/kabum-background.jpg', 1, 0, windowWidth, windowHeight).attr({
        opacity: 0.7
    });

    var curve = paper.path(getCircletoPath(200, 200, 150)).attr({ stroke: "" });
    var message = " Не знаю как связаться";
    textOnPath(message, curve, 13, 1.4, 3, 3, 70, "#4A5256", "normal");

    function getCircletoPath(x, y, r) { // x and y are center and r is the radius

        var s = "M";
        s = s + "" + (x - r) + "," + (y) + "A" + r + "," + r + ",0,1,1," + (x + r) + "," + (y) + "z";

        return s;
    }

    function textOnPath(message, path, fontSize, letterSpacing, kerning, geckoKerning, point, fontColor, fontWeight) {

        var gecko = /rv:([^\)]+)\) Gecko\/\d{8}/.test(navigator.userAgent || '') ? true : false;
        var letters = [], places = [], messageLength = 0;

        for (var c = 0; c < message.length; c++) {

            var letter = paper.text(0, 0, message[c]).attr({ "text-anchor": "middle", "fill": fontColor, "font-weight": fontWeight });
            var character = letter.attr('text'), kern = 0;
            letters.push(letter);

            if (kerning) {

                if (gecko && geckoKerning) {
                    kerning = geckoKerning;
                }

                var predecessor = letters[c - 1] ? letters[c - 1].attr('text') : '';

                if (kerning[c]) {

                    kern = kerning[c];

                } else if (kerning[character]) {

                    if (typeof kerning[character] === 'object') {
                        kern = kerning[character][predecessor] || kerning[character]['default'] || 0;
                    } else {
                        kern = kerning[character];
                    }
                }

                if (kerning['default']) {
                    kern = kern + (kerning['default'][predecessor] || 0);
                }
            }

            messageLength += kern;
            places.push(messageLength);
            //spaces get a width of 0, so set min at 4px
            messageLength += Math.max(4.5, letter.getBBox().width);
        }

        if (letterSpacing) {
            if (gecko) {
                letterSpacing = letterSpacing * 0.83;
            }
        } else {
            letterSpacing = letterSpacing || path.getTotalLength() / messageLength;
        }
        fontSize = fontSize || 10 * letterSpacing;

        for (c = 0; c < letters.length; c++) {
            letters[c].attr("font-size", fontSize + "px");
            p = path.getPointAtLength(places[c] * letterSpacing + point);
            var rotate = 'R' + (p.alpha < 180 ? p.alpha + 180 : p.alpha > 360 ? p.alpha - 360 : p.alpha) + ',' + p.x + ',' + p.y;
            letters[c].attr({ x: p.x, y: p.y, transform: rotate });

        }
    }
}

