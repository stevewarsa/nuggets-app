<?php
//header('Access-Control-Allow-Origin: *');
$user = $_GET['user'];
$db = new SQLite3('db/memory_' . $user . '.db');

$results = $db->query('select nugget_id from nugget');
header('Content-Type: application/json; charset=utf8');
$arrayName = array();
while ($row = $results->fetchArray()) {
    array_push($arrayName, $row);
}
$db->close();
print_r(json_encode($arrayName));
?>
