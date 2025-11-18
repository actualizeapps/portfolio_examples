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

$id = uniqid();
// Define the database file path
$dbFile = __DIR__ . '/queue/' . $id . '.json';

file_put_contents($dbFile, json_encode($entry, JSON_PRETTY_PRINT));

?>