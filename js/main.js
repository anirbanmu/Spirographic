'use strict';

// Gets all URL variables
function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
                                                                            vars[key] = value;
                                                                        });
    return vars;
}

function Vector2d(x, y) {
    this.x = x;
    this.y = y;
}

class CanvasRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.redraw = null;
    }

    resize(w, h) {
        this.width = w;
        this.height = h;
    }

    get width() {
        return this.canvas.width;
    }

    set width(w) {
        this.canvas.width = w;
    }

    get height() {
        return this.canvas.height;
    }

    set height(h) {
        this.canvas.height = h;
    }

    minDim() {
        return Math.min(this.width, this.height);
    }

    center() {
        return new Vector2d(this.width / 2, this.height / 2);
    }
}

class CanvasRenderer2D extends CanvasRenderer {
    constructor(canvas) {
        super(canvas);
        this.context = canvas.getContext('2d');
    }
}

function hypotrochoidX(R, r, d, theta) {
    return (R - r) * Math.cos(theta) + d * Math.cos(theta * (R - r) / r);
}

function hypotrochoidY(R, r, d, theta) {
    return (R - r) * Math.sin(theta) + d * Math.sin(theta * (R - r) / r);
}

function drawSpirograph(renderer) {
    let ctx = renderer.context;
    ctx.clearRect(0, 0, renderer.width, renderer.height);

    ctx.lineWidth = 1;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgb(231, 76, 60)';

    let R = Math.min(renderer.width, renderer.height) * 0.47;
    let r = 0.38575999999 * R;
    let d = 0.89 * r;

    let increment = 1024 * Math.PI / 4096;

    let center = renderer.center();

    ctx.beginPath();
    ctx.moveTo(center.x + hypotrochoidX(R, r, d, 0), center.y + hypotrochoidY(R, r, d, 0));

    for (let i = 1; i <= 4096; i++) {
        ctx.lineTo(center.x + hypotrochoidX(R, r, d, i * increment), center.y + hypotrochoidY(R, r, d, i * increment));
    }

    ctx.stroke();
}

function createCanvas(canvasContainer) {
    let newCanvas = $("<canvas style='z-index: " + 0 + "; position: absolute; left: 0; top: 0;' />");
    canvasContainer.append(newCanvas);
    return new CanvasRenderer2D(newCanvas[0]);
}

$(function () {
    let urlVars = getUrlVars();

    let canvasContainer = $('#canvasContainer');
    let renderer = createCanvas(canvasContainer);
    renderer.resize(window.innerWidth, window.innerHeight);
    drawSpirograph(renderer);
});