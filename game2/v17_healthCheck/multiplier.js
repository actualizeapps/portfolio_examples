class MultiplierTarget {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.target = null;
        this.radius = 25;
        this.color = '#FF4444';
        this.direction = 2;
    }
    
    create() {
        this.target = {
            x: Math.random() * (this.canvasWidth - 60) + 30,
            y: Math.random() * (this.canvasHeight - 60) + 30,
            radius: this.radius,
            color: this.color
        };
        return this.target;
    }
    
    clear() {
        this.target = null;
    }
    
    isHit(event) {
        if (!this.target) return false;
        
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        const distance = Math.sqrt(
            Math.pow(clickX - this.target.x, 2) + 
            Math.pow(clickY - this.target.y, 2)
        );
        
        return distance <= this.target.radius;
    }
    
    getTarget() {
        return this.target;
    }
    
    handleHit(currentCircleCount) {
        // Determine how many circles to add
        const circlesToAdd = currentCircleCount === 0 ? 1 : currentCircleCount;
        
        // Create a new X2 target in a random location
        this.create();
        
        return circlesToAdd;
    }
    
    draw(ctx) {
        if (!this.target) return;

        const { x, y, radius } = this.target;

        this.target.x += this.direction;
        if (this.target.x + this.target.radius >= this.canvas.width) {
            this.direction = -2;
          } else if (this.target.x - this.target.radius <= 0) {
            this.direction = 2;
        }
    
        // Flat modern fill color
        ctx.fillStyle = '#E34850';
    
        // Circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    
        // Thin black border (modern, subtle)
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    
        // White text (clean, readable)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 16px "Inter", "Helvetica Neue", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×2', x, y);
    }
}

