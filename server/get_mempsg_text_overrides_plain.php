<?php

//header('Access-Control-Allow-Origin: *');
include_once('./Passage.php');

$user = $_GET['user'];

$db = new SQLite3('db/memory_' . $user . '.db');
$statement = $db->prepare('select * from passage_text_override');
$results = $statement->execute();
$psgArray = array();
while ($row = $results->fetchArray()) {
	$obj = new stdClass;
    $obj->appendLetter = $row['passage_ref_append_letter'];
    $obj->verseText = $row['override_text'];
    $obj->passageId = $row['passage_id'];
    $obj->verseNumber = $row['verse_num'];
    $obj->verseNumber = $row['verse_num'];
    if ($row["words_of_christ"] == "Y") {
        $obj->wordsOfChrist = TRUE;
    } else {
        $obj->wordsOfChrist = FALSE;
    }
	$psgArray[$row["passage_id"]] = $obj;
}

$statement->close();
$db->close();
header('Content-Type: application/json; charset=utf8');
print_r(json_encode($psgArray));
?>