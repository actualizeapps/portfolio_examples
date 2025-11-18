class DotManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        this.addDotsFunction = null;
        this.getDataFunction = null;
        this.getDataStructureStatsFunction = null;
        this.resetDotsDataStructure();
        this.drawDotsFunction = this.drawUnsortedDots;
        this.gamePlayType = "";
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    createDot() {
        this.addDotsFunction();
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

    addUniqueHashSet() {
        const x = Math.round(Math.random() * (this.canvas.width - 10) + 5);
        const y = Math.round(Math.random() * (this.canvas.height - 10) + 5);

        const positionKey = `${x},${y}`;

        if (this.occupiedPositions.has(positionKey)) {
            return;
        }

        this.dots.add({x: x, y: y, radius: 1, color: this.getRandomColor()});
        this.occupiedPositions.add(positionKey);
    }

    addUniqueDynamicArray() {
        const x = Math.round(Math.random() * (this.canvas.width - 10) + 5);
        const y = Math.round(Math.random() * (this.canvas.height - 10) + 5);

        const newCircle = { x, y, radius: 1 };
        let overlaps = false;
        
        // Check against all existing circles
        for (let i = 0; i < this.dots.length; i++) {
            this.collisionsChecked++;
            if (newCircle.x == this.dots.data[i].x && newCircle.y == this.dots.data[i].y) {
                overlaps = true;
                break;
            }
        }
        
        if (!overlaps) {
            this.dots.add({x: x, y: y, radius: 1, color: this.getRandomColor()});
        }

    }

    
    getStats() {
        return "<p style='font-weight: bold;'>Data Structure Stats:</p><div style='padding-left: 20px;'>"+this.getDataStructureStatsFunction() + "</div>";
    }

    drawDot(dot) {
        this.ctx.beginPath();
        this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = dot.color;
        this.ctx.fill();
    }

    drawDotsSorted() {
        const spacing = this.canvas.width / (this.dots.length + 1); // +1 for padding
        const data = this.getDataFunction();
        for (let i = 0; i < this.dots.length; i++) {
            const dot = data[i];
            const x = spacing * (i + 1);
            this.drawDot({x: x, y: dot.y, radius: dot.radius, color: dot.color});
        }
    }

    drawUnsortedDots() {
        for (let i = 0; i < this.dots.length; i++) {
            this.drawDot(this.dots.data[i]);
        }
    }

    drawDots() {
        this.drawDotsFunction();
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

    getDotStatsWithTotalDots() {
        return "Total Dots: " + this.dots.length + "<br>" + this.dots.getStats();
    }

    addSortedDot() {
        const dot = {
            x: Math.random() * (this.canvas.width - 10) + 5,
            y: Math.random() * (this.canvas.height - 10) + 5,
            radius: 1,
            color: this.getRandomColor()
        };
        this.dots.addSorted(dot);
    }

    getCollisionDetectionStrategy() {
        const select = document.getElementById('dataStructure');
        return select.options[select.selectedIndex].text;
    }

    getGamePlayType() {
        return this.gamePlayType;
    }
    
    resetDotsDataStructure() {
        this.dots = new DynamicArray(undefined, RESIZE_STRATEGY.DOUBLE);
        this.collisionsChecked = 0;

        const dataStructure = document.getElementById('dataStructure').value;
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');

        if (mode === 'sorted') {
            this.gamePlayType = "Dots Sorted";
            this.addDotsFunction = () => this.addSortedDot();
            this.drawDotsFunction = this.drawDotsSorted;
            
            if (dataStructure.includes('linked')) {
                this.dots = new LinkedList(this.colors, (dot) => dot.color);
                this.getDataFunction = () => this.dots.convertToArray();
            } else if (dataStructure.includes('dynamic')) {
                if (dataStructure.includes('grow-by-1')) {
                    this.dots = new DynamicArray(10, RESIZE_STRATEGY.GROW_BY_1, this.colors, (dot) => dot.color);
                } else if (dataStructure.includes('double')) {
                    this.dots = new DynamicArray(10, RESIZE_STRATEGY.DOUBLE, this.colors, (dot) => dot.color);
                }
                this.getDataFunction = () => this.dots.data;
            } 

            this.getDataStructureStatsFunction = () => this.getDotStatsWithTotalDots();
        } else if (mode === 'unique') {
            this.gamePlayType = "Dots Unique";
            if (dataStructure.includes('hash')) {
                this.addDotsFunction = () => this.addUniqueHashSet();
                this.getDataStructureStatsFunction = () => this.getHashSetCollisionStats();
                if (dataStructure.includes('no-resize')) {
                    this.occupiedPositions = new CustomHashSet(undefined, BUCKET_RESIZE_STRATEGY.NONE, HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM);
                }else if (dataStructure.includes('char-code-sum')) {
                    this.occupiedPositions = new CustomHashSet(undefined, BUCKET_RESIZE_STRATEGY.DYNAMIC, HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM);
                } else if (dataStructure.includes('prime-multiply')) {
                    this.occupiedPositions = new CustomHashSet(undefined, BUCKET_RESIZE_STRATEGY.DYNAMIC, HASH_FUNCTION_STRATEGY.PRIME_MULTIPLY);
                } 
            } else if (dataStructure.includes('dynamic')) {
                this.addDotsFunction = () => this.addUniqueDynamicArray();
                this.getDataStructureStatsFunction = () => this.getDynamicArrayCollisionStats();
            }
    
        } else { // default.
            this.gamePlayType = "Dots Unique After 3";
            if (dataStructure.includes('hash')) {
                this.addDotsFunction = () => this.addUniqueXHashMap();
                this.getDataStructureStatsFunction = () => this.getHashSetCollisionStats();
                if (dataStructure.includes('no-resize')) {
                    this.occupiedPositions = new CustomHashMap(undefined, BUCKET_RESIZE_STRATEGY.NONE, HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM);
                }else if (dataStructure.includes('char-code-sum')) {
                    this.occupiedPositions = new CustomHashMap(undefined, BUCKET_RESIZE_STRATEGY.DYNAMIC, HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM);
                } else if (dataStructure.includes('prime-multiply')) {
                    this.occupiedPositions = new CustomHashMap(undefined, BUCKET_RESIZE_STRATEGY.DYNAMIC, HASH_FUNCTION_STRATEGY.PRIME_MULTIPLY);
                } 
            } else if (dataStructure.includes('dynamic')) {
                this.addDotsFunction = () => this.addUniqueXDynamicArray();
                this.getDataStructureStatsFunction = () => this.getDynamicArrayCollisionStats();
            }
    
        }

    }
}

