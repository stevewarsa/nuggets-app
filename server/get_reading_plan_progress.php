<?php
//header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

$user = $_GET['user'];
$dayOfWeek = $_GET['dayOfWeek'];

$db = new SQLite3('db/memory_' . $user . '.db');
// grab the last book chapter read for the current day of the week
$results = $db->query("SELECT day_of_week, book_name, book_id, chapter, date_read FROM reading_plan_progress where day_of_week = '" . $dayOfWeek . "' order by date_read DESC, chapter DESC LIMIT 1");
$obj = null;
while ($row = $results->fetchArray()) {
	$obj = new stdClass;
	$obj->bookId = $row['book_id'];
	$obj->bookName = $row['book_name'];
	$obj->chapter = $row['chapter'];
        $obj->dateRead = $row['date_read'];
        break;
}
$db->close();
print_r(json_encode($obj));
?>
