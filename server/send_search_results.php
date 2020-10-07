<?php
//header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json; charset=utf8');

include_once('./Passage.php');

$request = file_get_contents('php://input');
error_log("Here is the incoming request: ");
error_log($request);
$input = json_decode($request);

$emailTo = $input->emailTo;
$searchResults = $input->searchResults;
// Search Param contains:
//	book
//	translation
//	testament
//	searchPhrase
//	user
$searchParam = $input->searchParam;

$book = $searchParam->book;
$translation = $searchParam->translation;
$testament = $searchParam->testament;
$searchPhrase = $searchParam->searchPhrase;
$fromUser = $searchParam->user;

error_log("Received data: fromUser=" . $fromUser . ", emailTo=" . $emailTo);

error_log('Emailing ' . $emailTo . ' with search results...');
// now email user with search results
$msg = "
	<html>
	<head>
	<title>Search Results from " . $fromUser . "</title>
	</head>
	<body>
	</body>
	</html>
";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
// send email
mail($emailTo, "Search results from " . $fromUser, $msg, $headers);
error_log("The search results have been emailed.");

// now update the email preference in the from user's database
$db = new SQLite3('db/memory_' . $fromUser . '.db');
$statement = $db->prepare('update preferences set value = :lastSearchResultsEmail where key = :key');
$statement->bindValue(':key', 'last_search_results_email');
$statement->bindValue(':lastSearchResultsEmail', $emailTo);
$statement->execute();
$statement->close();

if ($db->changes() < 1) {
	error_log("There were no updates made so inserting new preference for lastSearchResultsEmail with value " . $emailTo);
	// there was no matching preference, so insert it
	$statement = $db->prepare('insert into preferences (key,value) values (:key, :value)');
	$statement->bindValue(':key', 'last_search_results_email');
	$statement->bindValue(':value', $emailTo);
	$statement->execute();
	$statement->close();
}
$db->close();

header('Content-Type: application/json; charset=utf8');

print_r(json_encode("success"));

?>