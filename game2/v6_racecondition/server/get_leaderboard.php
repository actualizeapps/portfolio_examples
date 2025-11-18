<?php

$dbFile = __DIR__ . '/leaderboard_db.txt';

$entries = [];
if (file_exists($dbFile)) {
    $fileContent = file_get_contents($dbFile);
    if (!empty($fileContent)) {
        $entries = json_decode($fileContent, true) ?: [];
    }
}

echo json_encode($entries);
?>