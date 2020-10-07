<?php
//header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json; charset=utf8');
include_once('./Objection.php');

ini_set ('memory_limit', '150M');
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON);

error_log("Here is the JSON sent in: ");
error_log($inputJSON);
$user = $input->user;
$category = $input->category;
$searchPhrase = $input->searchPhrase;
error_log("Here is the search string sent in: ");
error_log($searchPhrase);
$modSearchString = strtoupper($searchPhrase);
error_log($modSearchString);
$modSearchString = str_replace('*', '%', $modSearchString);
error_log($modSearchString);

if (!(strpos($modSearchString, "%") === 0)) {
    $modSearchString = "%" . $modSearchString;
}
error_log($modSearchString);

if (!((strpos($modSearchString, "%") + 1) === strlen($modSearchString))) {
    $modSearchString = $modSearchString . "%";
}

$db = new SQLite3('db/memory_' . $user . '.db');
if ($category == "quote") {
	$selectSql = "SELECT o.objection_id, objection_text, answer_text FROM common_objection o, common_objection_answer oa where o.objection_id = oa.objection_id and objection_category = '" . $category . "' and answer_id = 1 and upper(answer_text) like :searchString";
} else if ($category == "fact") {
	$selectSql = "SELECT o.objection_id, objection_text, answer_text FROM common_objection o, common_objection_answer oa where o.objection_id = oa.objection_id and objection_category = '" . $category . "' and answer_id = 1 and (upper(answer_text) like :searchString or upper(objection_text) like :searchString)";
} else {
	error_log("Unrecognized category: " . $category);
	print_r("failed");
	$db->close();
	exit();
}
$statement = $db->prepare($selectSql);
$statement->bindValue(':searchString', $modSearchString);
$results = $statement->execute();
$arrayName = array();
while ($row = $results->fetchArray()) {
    $objection = new Objection();
    $objection->objectionId = $row['objection_id'];
    $objection->prompt = $row['objection_text'];
    $objection->answer = $row['answer_text'];
    $objection->category = "quote";
    $objection->answerId = 1;
    array_push($arrayName, $objection);
}
$db->close();
print_r(json_encode($arrayName));
?>
