<?php
//header('Access-Control-Allow-Origin: *');
$db = new SQLite3('db/biblenuggets.db');

$results = $db->query('select passage_id from passage');
header('Content-Type: application/json; charset=utf8');
$arrayName = array();
while ($row = $results->fetchArray()) {
    array_push($arrayName, $row);
}
$db->close();
print_r(json_encode($arrayName));
?>