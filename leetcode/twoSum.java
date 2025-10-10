// return the indices which add to the target.
public int[] twoSum(int[] nums, int target) { 

    Set<Int> numsAsSet = putNumbersIntoSet(nums);

    int[] results = loopAndFindMatchesInSet(numsAsSet, nums, target);
}

public int[] loopAndFindMatchesInSet(Set<Int> numsAsSet, 
                                     int[]  nums, int target) {
    for number in nums {
        if hasTargetInSet(number, target, set) {
            addMatchToList();
        }
    }
}