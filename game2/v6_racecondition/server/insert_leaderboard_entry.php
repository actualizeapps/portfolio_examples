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

// Open file for reading + writing (create if doesn't exist)
$filePointer = fopen($dbFile, 'c+'); // c+ lets you read/write & creates file if missing

if (flock($filePointer, LOCK_EX)) { // exclusive lock
    // read existing
    $fileSize = filesize($dbFile);
    $fileContent = $fileSize > 0 ? fread($filePointer, $fileSize) : '';
    $entries = $fileContent ? json_decode($fileContent, true) : [];

    // add entry + sort
    $entries[] = $entry;
    $entries = sortEntries($entries);

    // delete current file contents
    ftruncate($filePointer, 0);
    // set the pointer to the beginning of the file 
    rewind($filePointer);

    fwrite($filePointer, json_encode($entries, JSON_PRETTY_PRINT));

    // Done
    fflush($filePointer);
    flock($filePointer, LOCK_UN);
} else {
    // lock failed (rare, but good practice)
    error_log("Could not lock leaderboard file");
}

fclose($filePointer);


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