<?php

$dbFile = __DIR__ . '/leaderboard_db.txt';

$endDate = $_GET['endDate'];

$entries = [];
if (file_exists($dbFile)) {
    $fileContent = file_get_contents($dbFile);
    if (!empty($fileContent)) {
        $entries = json_decode($fileContent, true) ?: [];
    }
}

if ($endDate != null) {    
    $entries = accumulateScoresAndFilterTime($entries, $endDate);
    $entries = mergeSort($entries);
}

echo json_encode($entries);

function accumulateScoresAndFilterTime($entries, $endDate = null) {
    $accumulated = []; // hashmap/dictionary

    foreach ($entries as $entry) {
        // Skip entries outside the date range
        if ($endDate !== null && $entry['time'] < $endDate) {
            continue;
        }

        $name = $entry['name'];

        if (!isset($accumulated[$name])) {
            $accumulated[$name] = [
                'name' => $name,
                'score' => 0
            ];
        }

        $accumulated[$name]['score'] += $entry['score'];
    }

    return array_values($accumulated); // convert to indexed array for sorting
}



function mergeSort($entries) {
    $count = count($entries);
    if ($count <= 1) {
        return $entries;
    }

    $midIndex = intdiv($count, 2);

    $leftHalf = getHalf($entries, 0, $midIndex);
    $rightHalf = getHalf($entries, $midIndex, $count);

    $leftHalf = mergeSort($leftHalf);
    $rightHalf = mergeSort($rightHalf);

    $merged = [];
    $leftPointer = 0;
    $rightPointer = 0;
    $leftCount = count($leftHalf);
    $rightCount = count($rightHalf);

    // merge two sorted lists
    while ($leftPointer < $leftCount && $rightPointer < $rightCount) {
        if ($leftHalf[$leftPointer]['score'] >= $rightHalf[$rightPointer]['score']) {
            $merged[] = $leftHalf[$leftPointer];
            $leftPointer++;
        } else {
            $merged[] = $rightHalf[$rightPointer];
            $rightPointer++;
        }
    }

    if ($leftPointer < $leftCount) {
        $merged = appendUnmergedElements($merged, $leftHalf, $leftPointer, $leftCount);
    }

    if ($rightPointer < $rightCount) {
        $merged = appendUnmergedElements($merged, $rightHalf, $rightPointer, $rightCount);
    }

    return $merged;
}

function getHalf($array, $start, $end) {
    $result = [];
    for ($i = $start; $i < $end; $i++) {
        $result[] = $array[$i];
    }
    return $result;
}

function appendUnmergedElements($merged, $array, $index, $count) {
    while ($index < $count) {
        $merged[] = $array[$index];
        $index++;
    }
    return $merged;
}

function sortEntries($entries) {
    $sortedEntries = [];
    for ($i = 0; $i < count($entries); $i++) {
        $biggestPriority = -1;
        $biggestPriorityIndex = -1;
        for ($j = 0; $j < count($entries); $j++) {
            $sortedEntry = $entries[$j];
            if ($sortedEntry['score'] > $biggestPriority) {
                $biggestPriority = $sortedEntry['score'];
                $biggestPriorityIndex = $j;
            }
        }
        if ($biggestPriorityIndex !== -1) {
            $sortedEntries[] = $entries[$biggestPriorityIndex];
            $entries[$biggestPriorityIndex]['score'] = -1;
        }
    }
    return $sortedEntries;
}
?>