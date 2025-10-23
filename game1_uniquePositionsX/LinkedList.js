class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor(orderArray = null, keyFunction = null) {
        this.orderArray = orderArray;
        this.length = 0;
        this.keyFunction = keyFunction;
        this.averageAddTime = 0;
        this.addCount = 0;
        this.perfTimer = null;
        if (orderArray) {
            this.initializeEmptyPriorityNodes();
        }
    }

    getStats() {
        return "Linked List<br>Wasted space: 0<br>Average add time: "+this.averageAddTime.toFixed(40)+"<br>Number of elements shifted: 0"+"<br>Number of Times Resized: 0<br>"+this.getBigOInfo();
    }

    getBigOInfo() {
        return "'addSorted' time: O(1), space: O(1)";
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

    initializeEmptyPriorityNodes() {
        // Create placeholder node for each priority
        this.priorityNodes = {};
        let prev = null;
        this.head = null;
        
        for (let i = 0; i < this.orderArray.length; i++) {
            const emptyNode = new Node(null); // Empty placeholder
            if (this.head === null) {
                this.head = emptyNode;
            } else {
                prev.next = emptyNode;
            }

            this.priorityNodes[i] = {
                lastNodeAtPriority: emptyNode    // Last real data node for this priority
            };

            prev = emptyNode;
        }
    }

    // Get the sort priority of a value based on the order array
    getOrderPriority(value) {
        let key = value;
        if (this.keyFunction !== null) {
            key = this.keyFunction(value);
        }
        
        const index = this.orderArray.indexOf(key);
        return index === -1 ? this.orderArray.length : index;
    }

    // Insert element in sorted order
    addSorted(element) {
        this.startPerfTimer();
        const priority = this.getOrderPriority(element);
        const bucket = this.priorityNodes[priority];
        
        const newNode = new Node(element);
        
        newNode.next = bucket.lastNodeAtPriority.next;
        bucket.lastNodeAtPriority.next = newNode;
        bucket.lastNodeAtPriority = newNode;
              
        this.length++;
        this.endPerfTimer();
    }

    add(element) {
        this.startPerfTimer();
        const newNode = new Node(element);
        newNode.next = this.head;
        this.head = newNode;
        this.length++;
        this.endPerfTimer();
    }

    convertToArray() {
        const array = [];
        let current = this.head;
        while (current) {
            if (current.data !== null) {
                array.push(current.data);
            }
            current = current.next;
        }
        return array;
    }
}
