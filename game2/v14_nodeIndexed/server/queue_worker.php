<?php
$queueDir = __DIR__ . '/queue/';
$leaderboardFile = __DIR__ . '/leaderboard_db.txt';

while (true) {
    // Load leaderboard
    $entries = [];
    if (file_exists($leaderboardFile)) {
        $content = file_get_contents($leaderboardFile);
        if (!empty($content)) {
            $entries = json_decode($content, true) ?: [];
        }
    }
    // Get all files in queue folder
    $queueFiles = glob($queueDir . '*.json'); // or "*.*" if needed

    foreach ($queueFiles as $file) {
        $data = file_get_contents($file);
        if (empty($data)) continue;

        $entry = json_decode($data, true);
        if (!is_array($entry)) continue;

        // Insert entry into leaderboard sorted
        $entries = insertSortedBinarySearch($entries, $entry);

        // Delete the queue file
        unlink($file);
    }
    //$entries = sortEntries($entries);

    // Save updated leaderboard
    file_put_contents($leaderboardFile, json_encode($entries, JSON_PRETTY_PRINT));

    usleep(100000); // 100ms
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

function insertSortedBinarySearch($entries, $entry) {
    $low = 0;
    $high = count($entries) - 1;
    while ($low <= $high) {
        $mid = floor(($low + $high) / 2);
        if ($entries[$mid]['score'] < $entry['score']) {
            $high = $mid - 1;
        } else {
            $low = $mid + 1;
        }
    }
    array_splice($entries, $low, 0, [$entry]);
    return $entries;
}

?>