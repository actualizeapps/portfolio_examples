<?php

$name = $_POST['name'];
$score = $_POST['score'];
$time = $_POST['time'];
$gameType = $_POST['gameType'];
$dataStructure = $_POST['dataStructure'];


// Create the data entry
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

// Write back to file
file_put_contents($dbFile, json_encode($entries, JSON_PRETTY_PRINT));

echo json_encode($entries);

?>