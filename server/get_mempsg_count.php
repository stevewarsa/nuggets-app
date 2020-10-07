<?php


//header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

$user = $_GET['user'];
$db = new SQLite3('db/memory_' . $user . '.db');
$results = $db->query("select count(*) as ct from memory_passage");
$ct = 0;
while ($row = $results->fetchArray()) {
    $ct = $row['ct'];
    break;
}

$db->close();

print_r(json_encode($ct));

?>

