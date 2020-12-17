<?php

$translation = $_GET['translation'];
$db = new SQLite3('db/' . $translation . '.db');
$book = $_GET['book'];
$chapter = (int)$_GET['chapter'];
$startVerse = (int)$_GET['start'];
$endVerse = (int)$_GET['end'];
$statement = $db->prepare('select group_concat(verse_text, " ") as "vt" from (select verse_text from verse v, book b where v.book_id = b._id and b.book_name = :book_name and chapter = :chapter and verse >= :start_verse and verse <= :end_verse order by verse, verse_part_id)');

$statement->bindValue(':book_name', $book);
$statement->bindValue(':chapter', $chapter);
$statement->bindValue(':start_verse', $startVerse);
$statement->bindValue(':end_verse', $endVerse);
$results = $statement->execute();
$passageString = "";

while ($row = $results->fetchArray()) {
    $passageString = $passageString . $row["vt"] . " ";
}
$statement->close();
$db->close();
header('Content-Type: application/json; charset=utf8');
print_r(json_encode(trim($passageString)));
?>
