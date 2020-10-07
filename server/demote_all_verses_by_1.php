<?php

//header('Access-Control-Allow-Origin: *');
$user = $_GET['user'];
$passageId = $_GET['passage_id'];

$db = new SQLite3('db/memory_' . $user . '.db');
$statement = $db->prepare("update memory_passage set frequency_days = frequency_days + 1 where queued = 'N' and frequency_days >= 1 and passage_id != :passage_id");
$statement->bindValue(':passage_id', $passageId);
$statement->execute();
$statement->close();

$statement = $db->prepare("update memory_passage set frequency_days = frequency_days + 2 where queued = 'N' and frequency_days = -1 and passage_id != :passage_id");
$statement->bindValue(':passage_id', $passageId);
$statement->execute();

$statement->close();
$db->close();

header('Content-Type: application/json; charset=utf8');

print_r(json_encode("success"));

?>