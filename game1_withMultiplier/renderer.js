class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawDot(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = dot.color;
        this.ctx.fill();
    }
    
    drawDots(dots) {
        for (let i = 0; i < dots.length; i++) {
            this.drawDot(dots.data[i]);
        }
    }
    
    getContext() {
        return this.ctx;
    }
}

