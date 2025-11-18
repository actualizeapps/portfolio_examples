//'Enum' in javascript:
const RESIZE_STRATEGY = Object.freeze({
  GROW_BY_1: 1,
  DOUBLE: 2,
});

class DynamicArray {
    constructor(capacity, resizeStrategy=RESIZE_STRATEGY.GROW_BY_1) {
        this.capacity = capacity;
        this.data = new Array(this.capacity);
        this.length = 0
        this.countResize = 0;
        this.totalAddTime = 0;
        this.addCount = 0;
        this.resizeStrategy = resizeStrategy
    }
    getResizeStrategy() {
        return this.resizeStrategy === RESIZE_STRATEGY.GROW_BY_1 ? "Grow by 1" : "Double";
    }

    getStats() {
        return "Dynamic Array Resize Strategy: "+this.getResizeStrategy() + "<br>" +
        "Total time: " + (this.totalAddTime/1000).toFixed(2) + " seconds<br>"
        + "Items added: " +this.addCount + "<br>"
        + "Time per 10K adds: " + ((this.totalAddTime/this.addCount)*10).toFixed(3) + " seconds<br>"
        + "Wasted space: " +(this.capacity - this.length) + "<br>"
        + "Number of Times Resized: " +this.countResize + "<br>"
        + this.getBigOInfo();
    }

    getBigOInfo() {
        if (this.resizeStrategy === RESIZE_STRATEGY.GROW_BY_1) {
            return "'BigO add' time: O(n), space: O(n)";
        } else if (this.resizeStrategy === RESIZE_STRATEGY.DOUBLE) {
            return "'BigO add' time: O(1), space: O(n)";
        }
    }

    add(element) {
        const startTime = performance.now();
        // Check if we need to grow the array
        if (this.length >= this.capacity) {
            this.countResize++;
            if (this.resizeStrategy == RESIZE_STRATEGY.GROW_BY_1) {
                this.capacity += 1; // Grow by 1
            } else if (this.resizeStrategy == RESIZE_STRATEGY.DOUBLE) {
                this.capacity = this.capacity * 2; // Grow by double
            }

            const newData = new Array(this.capacity);

            // Copy existing elements to new array
            for (let i = 0; i < this.length; i++) {
                newData[i] = this.data[i];
            }
            this.data = newData;
        }
        
        this.data[this.length] = element;
        this.length+=1;
        const timeItTook = performance.now() - startTime
        this.addCount++;
        this.totalAddTime += timeItTook;
    }

    print() {
        var result = ''
        for (let i = 0; i < this.length; i++) {
            result += this.data[i] + ', '
        }

        return result;
    }
}