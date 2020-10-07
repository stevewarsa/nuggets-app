<?php
//header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');
include_once('./Objection.php');

$user = $_GET['user'];

$db = new SQLite3('db/memory_' . $user . '.db');
    $results = $db->query("SELECT o.objection_id, objection_text, answer_text FROM common_objection o, common_objection_answer oa where o.objection_id = oa.objection_id and objection_category = 'fact' and answer_id = 1");
    $arrayName = array();
    while ($row = $results->fetchArray()) {
        $objection = new Objection();
        $objection->objectionId = $row['objection_id'];
        $objection->prompt = $row['objection_text'];
        $objection->answer = $row['answer_text'];
	$objection->category = "fact";
	$objection->answerId = 1;
        array_push($arrayName, $objection);
    }
    $db->close();
    print_r(json_encode($arrayName));
?>
