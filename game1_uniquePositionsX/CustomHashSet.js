const BUCKET_RESIZE_STRATEGY = Object.freeze({
    NONE: 1,
    DYNAMIC: 2,
  });

const HASH_FUNCTION_STRATEGY = Object.freeze({
    CHAR_CODE_SUM: 1,
    PRIME_MULTIPLY: 2
  });

class CustomHashSet {
    constructor(initialSize = 50, bucketResizeStrategy = BUCKET_RESIZE_STRATEGY.DYNAMIC, hashStrategy = HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM) {
        this.buckets = new DynamicArray(initialSize);
        this.bucketResizeStrategy = bucketResizeStrategy;
        this.hashStrategy = hashStrategy;
        // Initialize all buckets to null
        for (let i = 0; i < initialSize; i++) {
            this.buckets.add(null);
        }
        this.size = 0;
        this.bucketCount = initialSize;
        this.loadFactor = 0.75; // Resize when 75% full
        this.hasChecks = 0;
    }

    // Simple hash function for strings and numbers
    hash(key) {
        let hash = 0;
        const str = String(key);
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            if (this.hashStrategy === HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM) {
                hash = hash + char;
            } else if (this.hashStrategy === HASH_FUNCTION_STRATEGY.PRIME_MULTIPLY) {
                hash = hash * 31 + char;
            } 
        }
        return Math.abs(hash) % this.bucketCount;
    }

    getStrategyInfo() {
        let strategyInfo = "";
        if (this.hashStrategy === HASH_FUNCTION_STRATEGY.CHAR_CODE_SUM) {
            strategyInfo += "HashFunction: Char Code Sum<br>";
        } else if (this.hashStrategy === HASH_FUNCTION_STRATEGY.PRIME_MULTIPLY) {
            strategyInfo += "HashFunction: Prime Multiply<br>";
        }

        if (this.bucketResizeStrategy === BUCKET_RESIZE_STRATEGY.NONE) {
            strategyInfo += "BucketResizeStrategy: No Resize";
        } else if (this.bucketResizeStrategy === BUCKET_RESIZE_STRATEGY.DYNAMIC) {
            strategyInfo += "BucketResizeStrategy: Dynamic Resize";
        }
        return strategyInfo;
    }

    // Add an element to the set
    add(element) {
        if (this.has(element)) {
            return false; // Already exists
        }

        // Resize if load factor exceeded
        if (this.size >= this.bucketCount * this.loadFactor) {
            if (this.bucketResizeStrategy === BUCKET_RESIZE_STRATEGY.DYNAMIC) {
                this._resize();
            }
        }

        const index = this.hash(element);
        
        // Initialize bucket with LinkedList if empty
        if (!this.buckets.data[index]) {
            this.buckets.data[index] = new LinkedList();
        }
        
        this.buckets.data[index].add(element);
        this.size++;
        return true;
    }

    // Check if element exists - O(1) average case
    has(element) {
        const index = this.hash(element);
        const bucket = this.buckets.data[index];
        this.hasChecks++;

        if (!bucket) {
            return false;
        }
        
        // Search through the linked list
        let current = bucket.head;
        while (current) {
            if (current.data === element) {
                return true;
            }
            current = current.next;
        }
        return false;
    }
    
    // Resize the hash table when load factor is exceeded
    _resize() {
        const oldBuckets = this.buckets;
        const oldBucketCount = this.bucketCount;
        
        this.bucketCount *= 2;
        this.buckets = new DynamicArray(this.bucketCount);
        
        // Initialize all new buckets to null
        for (let i = 0; i < this.bucketCount; i++) {
            this.buckets.add(null);
        }
        
        this.size = 0;

        // Rehash all elements from old buckets
        for (let i = 0; i < oldBucketCount; i++) {
            const bucket = oldBuckets.data[i];
            if (bucket) {
                let current = bucket.head;
                while (current) {
                    this.add(current.data);
                    current = current.next;
                }
            }
        }
    }

    // Get current size
    getSize() {
        return this.size;
    }

    // Clear all elements
    clear() {
        this.buckets = new DynamicArray(this.bucketCount);
        for (let i = 0; i < this.bucketCount; i++) {
            this.buckets.add(null);
        }
        this.size = 0;
    }


    getBigOInfo() {
        return "BigO: 'add' time: O(1), space: O(1)<br>'has' time: O(1), space: O(1)";
    }

    // Debug method to see bucket distribution
    getStats() {
        let filledBuckets = 0;
        let maxChainLength = 0;
        
        for (let i = 0; i < this.bucketCount; i++) {
            const bucket = this.buckets.data[i];
            if (bucket && bucket.length > 0) {
                filledBuckets++;
                maxChainLength = Math.max(maxChainLength, bucket.length);
            }
        }
        const emptyBuckets = this.bucketCount - filledBuckets;
        const emptyBucketRate = (emptyBuckets / this.bucketCount) * 100;
        const elementsToBucketRatio = (this.size / this.bucketCount);

        const averageChainLength = filledBuckets > 0 ? Number((this.size / filledBuckets).toFixed(2)) : 0;

        return "Custom HashSet"
        +"<br>"+this.getStrategyInfo()
        +"<br>Checks If Exists: "+this.hasChecks
        +"<br>Total Buckets: "+ this.bucketCount
        +"<br>Total Elements: "+ this.size
        +"<br>Empty Buckets: "+ emptyBuckets
        +"<br>Empty Bucket Rate: "+ emptyBucketRate + "%"
        +"<br>Expected elements per bucket: "+ elementsToBucketRatio
        +"<br>Average elements per bucket: "+averageChainLength
        +"<br>Max elements in a bucket: "+maxChainLength+"<br>"
        +this.getBigOInfo();
    }
}
