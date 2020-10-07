<?php

//header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf8');

include_once('./Book.php');
include_once('./Passage.php');

function newest($a, $b) { 
    return filemtime($b) - filemtime($a); 
} 
$db = new SQLite3('db/niv.db');
$results = $db->query('select _id, book_name, (select max(chapter) from verse where book_id = _id) as last_chapter from book');

$books = array();
while ($row = $results->fetchArray()) {
    $book = new Book();
    $book->bookId = $row['_id'];
    $book->bookName = $row['book_name'];
    $book->maxChapter = $row['last_chapter'];
    $books[$row['_id']] = $book;
}

$db->close();

$userArray = array();
$files = glob('db/memory_*');
uasort($files, "newest"); 
foreach ($files as $file) {
	$fname = basename($file);
	if ($fname == 'memory_.db' || $fname == 'memory_template.db' || $fname == 'memory_template.db.old' || $fname == 'memory_template.db.bak') {
		continue;
	}
	$parts = explode("_", $fname);
	$userName = explode(".db", $parts[1]);
	$numLastMod = filemtime($file);
	$lastModified = date('F d Y, H:i:s',$numLastMod);
	
	$obj = new stdClass;
	$obj->fileName = $fname;
	$obj->userName = $userName[0];
	$obj->numLastMod = $numLastMod;
	$obj->lastModified = $lastModified;
	error_log('Opening database "db/memory_' . $userName[0] . '.db"');
	$db = new SQLite3('db/memory_' . $userName[0] . '.db');
	$queryStr = "select p.passage_id, book_id, chapter, start_verse, end_verse, m.preferred_translation_cd, frequency_days, last_viewed_str, last_viewed_num from passage p, memory_passage m where m.passage_id = p.passage_id and queued = 'N'";
	$results = $db->query($queryStr);

	if ($results == null) {
		error_log('Database "db/memory_' . $userName[0] . '.db" had no results for query: ' . $queryStr);
		$db->close();
		array_push($userArray, $obj);
		continue;
	}
	$psgArray = array();
	while ($row = $results->fetchArray()) {
		$passage = new Passage();
		$passage->passageId = $row['passage_id'];
		$passage->bookId = $row['book_id'];
		$passage->bookName = $books[$row['book_id']]->bookName;
		$passage->chapter = $row['chapter'];
		$passage->startVerse = $row['start_verse'];
		$passage->endVerse = $row['end_verse'];
		$passage->translationName = $row['preferred_translation_cd'];
		$passage->frequencyDays = $row['frequency_days'];
		$passage->last_viewed_str = $row['last_viewed_str'];
		$passage->last_viewed_num = $row['last_viewed_num'];
		array_push($psgArray, $passage);
	}

	$db->close();
	$obj->passages = $psgArray;
	array_push($userArray, $obj);
}

print_r(json_encode($userArray));
?>