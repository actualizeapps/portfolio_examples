//'Enum' in javascript:
const RESIZE_STRATEGY = Object.freeze({
  GROW_BY_1: 1,
  DOUBLE: 2,
});

class DynamicArray {
    constructor(capacity=10, resizeStrategy=RESIZE_STRATEGY.GROW_BY_1, orderArray = null, keyFunction = null) {
        this.capacity = capacity;
        this.data = new Array(this.capacity);
        this.length = 0
        this.countResize = 0;
        this.averageAddTime = 0;
        this.addCount = 0;
        this.resizeStrategy = resizeStrategy
        this.orderArray = orderArray;
        // The key function lets us determine an element’s sort priority, even if the element is an object.
        // For example, for an object like dot: { x: 1, y: 2, radius: 1, color: 'green' },
        // the key function can return only the color ('green') to use for sorting.
        this.keyFunction = keyFunction;
        this.perfTimer = null;
        this.numberOfElementsShifted = 0;
    }

    getResizeStrategy() {
        return this.resizeStrategy === RESIZE_STRATEGY.GROW_BY_1 ? "Grow by 1" : "Double";
    }

    getStats() {
        return "Dynamic Array<br>Resize Strategy: "+this.getResizeStrategy()+"<br>Wasted space: "+(this.capacity - this.length)+"<br>Average add time: "+this.averageAddTime.toFixed(40)+"<br>Number of Times Resized: "+this.countResize +"<br>Number of Elements Shifted: "+this.numberOfElementsShifted;
    }

    startPerfTimer() {
        this.perfTimer = performance.now();
    }

    endPerfTimer() {
        if (!this.perfTimer) {
            return;
        }
        const startTime = this.perfTimer;
        const timeItTook = performance.now() - startTime;
        this.addCount++;
        this.averageAddTime = (this.averageAddTime + timeItTook) / this.addCount;
        this.perfTimer = null;
    }

    add(element) {
        this.startPerfTimer();
        // Check if we need to grow the array
        if (this.length >= this.capacity) {
            this.grow();
        }
        
        this.data[this.length] = element;
        this.length+=1;
        this.endPerfTimer();
    }

    getOrderPriority(value) {
        let key = value;
        if (this.keyFunction !== null) {
            key = this.keyFunction(value);
        }
        const index = this.orderArray.indexOf(key);
        return index === -1 ? this.orderArray.length : index;
    }

    // Find where to insert an element to maintain sort order
    findInsertPosition(element) {
        if (!this.orderArray) {
            return this.length; // Just add at end if no ordering
        }
        
        const elementPriority = this.getOrderPriority(element);
        //Loop through the array and find the first index where our elementPriority is smaller than the currentPriority
        // Ex: [2, 2, 3], add(2), -> [2, 2, 2(new), 3] - adds at the end of the 2s which preserves relative order of insertion.
        for (let i = 0; i < this.length; i++) {
            const currentPriority = this.getOrderPriority(this.data[i]);
            if (elementPriority < currentPriority) {
                return i;
            }
        }
        
        return this.length; // Insert at end if no smaller priority found
    }

    // Insert element in sorted order
    addSorted(element) {
        this.startPerfTimer();
        // Check if we need to grow the array
        if (this.length >= this.capacity) {
            this.grow();
        }
        
        const insertPosition = this.findInsertPosition(element);
        // Insert and shift elements to the right
        let carry = element; // the value to insert or move along
        for (let i = insertPosition; i <= this.length; i++) {
            const temp = this.data[i];
            this.data[i] = carry;
            carry = temp;
            this.numberOfElementsShifted+=1;
        }

        this.length+=1;

        this.endPerfTimer();
    }

    grow() {
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

    print() {
        var result = ''
        for (let i = 0; i < this.length; i++) {
            result += this.data[i] + ', '
        }

        return result;
    }
}