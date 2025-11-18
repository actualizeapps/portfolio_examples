class DotManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        this.addUniqueFunction = null;
        this.getCollisionStatsFunction = null;
        this.resetDotsDataStructure();
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    createDot() {
        this.addUniqueFunction();
    }

    addUniqueXHashMap() {
        const x = Math.round(Math.random() * (this.canvas.width - 10) + 5);
        const y = Math.round(Math.random() * (this.canvas.height - 10) + 5);

        const positionKey = `${x},${y}`;

        const count = this.occupiedPositions.get(positionKey);
        if (count !== null) {
            if (count < 3) {
                this.occupiedPositions.set(positionKey, count + 1);
                this.dots.add({x: x, y: y, radius: 1, color: this.getRandomColor()});
            }
        } else {
            this.occupiedPositions.set(positionKey, 1);
            this.dots.add({x: x, y: y, radius: 1, color: this.getRandomColor()});
        }
    }

    addUniqueXDynamicArray() {
        const x = Math.round(Math.random() * (this.canvas.width - 10) + 5);
        const y = Math.round(Math.random() * (this.canvas.height - 10) + 5);

        const newCircle = { x, y, radius: 1 };
        let overlaps = false;
        let count = 1;
        for (let i = 0; i < this.dots.length; i++) {
            this.collisionsChecked++;
            if (newCircle.x == this.dots.data[i].x && newCircle.y == this.dots.data[i].y) {
                if (this.dots.data[i].count < 3) {
                    count = this.dots.data[i].count + 1;
                    this.dots.data[i].count = count;
                    break;
                }
            }
        }
    
        if (!overlaps) {
            this.dots.add({x: x, y: y, radius: 1, count: count, color: this.getRandomColor()});
        }

    }
    
    getStats() {
        return "<p style='font-weight: bold;'>Collision Detection Stats:</p><div style='padding-left: 20px;'>"+this.getCollisionStatsFunction() + "</div>";
    }

    drawDot(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = dot.color;
        this.ctx.fill();
    }

    drawDots() {
        for (let i = 0; i < this.dots.length; i++) {
            this.drawDot(this.dots.data[i]);
        }
    }

    addDots(count) {
        for (let i = 0; i < count; i++) {
            this.createDot();
        }
    }
    
    getDots() {
        return this.dots;
    }
    
    getCount() {
        return this.dots.length;
    }

    getDynamicArrayCollisionStats() {
        return "DynamicArray<br>Total Dots: " + this.dots.length + "<br>CollisionsChecked: " + this.collisionsChecked;
    }

    getHashSetCollisionStats() {
        return "Total Dots: " + this.dots.length + "<br>" +this.occupiedPositions.getStats()
    }
    
    resetDotsDataStructure() {
        this.dots = new DynamicArray(undefined, RESIZE_STRATEGY.DOUBLE);
        this.collisionsChecked = 0;

        const dataStructure = document.getElementById('dataStructure').value;
        if (dataStructure.includes('hash')) {
            this.addUniqueFunction = () => this.addUniqueXHashMap();
            this.getCollisionStatsFunction = () => this.getHashSetCollisionStats();
            if (dataStructure.includes('no-resize')) {
                this.occupiedPositions = new CustomHashMap(undefined, BUCKET_RESIZE_STRATEGY.NONE, HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM);
            }else if (dataStructure.includes('char-code-sum')) {
                this.occupiedPositions = new CustomHashMap(undefined, BUCKET_RESIZE_STRATEGY.DYNAMIC, HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM);
            } else if (dataStructure.includes('prime-multiply')) {
                this.occupiedPositions = new CustomHashMap(undefined, BUCKET_RESIZE_STRATEGY.DYNAMIC, HASH_FUNCTION_STRATEGY.PRIME_MULTIPLY);
            } 
        } else if (dataStructure.includes('dynamic')) {
            this.addUniqueFunction = () => this.addUniqueXDynamicArray();
            this.getCollisionStatsFunction = () => this.getDynamicArrayCollisionStats();
        }
    }
}

