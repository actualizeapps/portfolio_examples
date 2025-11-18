<?php

$name = $_POST['name'];
$score = $_POST['score'];
$time = $_POST['time'];
$gameType = $_POST['gameType'];
$dataStructure = $_POST['dataStructure'];

$entry = [
    'name' => $name,
    'score' => $score,
    'time' => $time,
    'gameType' => $gameType,
    'dataStructure' => $dataStructure
];

// Define the database file path
$dbFile = __DIR__ . '/leaderboard_db.txt';

// Read existing data
$entries = [];
if (file_exists($dbFile)) {
    $fileContent = file_get_contents($dbFile);
    if (!empty($fileContent)) {
        $entries = json_decode($fileContent, true) ?: [];
    }
}

// Add new entry
$entries[] = $entry;
$entries = sortEntries($entries);
// Write back to file
file_put_contents($dbFile, json_encode($entries, JSON_PRETTY_PRINT));

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