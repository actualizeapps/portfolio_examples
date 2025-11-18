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

    $entries = sortEntries($entries);
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