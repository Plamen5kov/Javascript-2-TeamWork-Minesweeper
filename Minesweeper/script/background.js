function loadBackground() {

    var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        paper = new Raphael('background', windowWidth - 5, windowHeight - 5);

    paper.image('imgs/kabum-background.jpg', 1, 0, windowWidth, windowHeight).attr({
        opacity: 0.7
    });

    var settings = ({
        'font-family': 'Verdana',
        'font-size': 36,
        'font-weight': 'bold',
        'stroke-width': 2,
        fill: '#6DA000',
        stroke: '#000000'
    });

    paper.text(windowWidth / 2, 200, 'MINESWEEPER').attr(settings).attr({
        'font-size': 45,
        'stroke-width': 3,
    });
    paper.text(5 * windowWidth / 6, 100, 'Telerik Academy').attr(settings);
    paper.text(5 * windowWidth / 6, 150, 'Team "Hornbuckle"').attr(settings);
}