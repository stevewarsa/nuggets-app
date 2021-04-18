<?php
//header('Access-Control-Allow-Origin: *');
$user = $_GET['user'];
$book = $_GET['book'];

// first get the book id based on the book name
$translDb = new SQLite3('db/niv.db');
$translStmt = $translDb->prepare('select _id from book where book_name = :book_name');
$translStmt->bindValue(':book_name', $book);
$translResults = $translStmt->execute();
$bookId = -1;
while ($translRow = $translResults->fetchArray()) {
    $bookId = $translRow["_id"];
    break;
}
$translStmt->close();
$translDb->close();

$chapter = $_GET['chapter'];
$startVerse = $_GET['start'];
$endVerse = $_GET['end'];

// now insert this as a nugget
$db = new SQLite3('db/memory_' . $user . '.db');
$statement = $db->prepare('insert into nugget (book_id, chapter, start_verse, end_verse) values(:book_id,:chapter,:start_verse,:end_verse)');
$statement->bindValue(':book_id', $bookId);
$statement->bindValue(':chapter', $chapter);
$statement->bindValue(':start_verse', $startVerse);
$statement->bindValue(':end_verse', $endVerse);
$statement->execute();
$statement->close();

// now get the newly generated nugget_id
$results = $db->query('SELECT last_insert_rowid() as nugget_id');
$nuggetId = -1;
while ($row = $results->fetchArray()) {
    $nuggetId = $row["nugget_id"];
    break;
}

$db->close();

header('Content-Type: application/json; charset=utf8');

print_r(json_encode($nuggetId));

?>
