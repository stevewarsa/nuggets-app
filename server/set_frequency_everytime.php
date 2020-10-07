<?php
//header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$request = file_get_contents('php://input');
$input = json_decode($request);

$user = $input->user;
$passageId = $input->passage->passageId;
$frequency = $input->passage->frequencyDays;

// update this passage 
$db = new SQLite3('db/memory_' . $user . '.db');

$statement = $db->prepare('update memory_passage set frequency_days = :frequency_days where passage_id = :passage_id');
$statement->bindValue(':frequency_days', $frequency);
$statement->bindValue(':passage_id', $passageId);
$statement->execute();
$statement->close();

$db->close();

header('Content-Type: application/json; charset=utf8');

print_r(json_encode("success"));

?>