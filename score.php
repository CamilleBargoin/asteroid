<?php

	$file = 'score.txt';

	if(isset($_POST['callFunction'])) {

		if ($_POST['callFunction'] == "saveScore")
			saveScore();
		else if ($_POST['callFunction'] == "getScores")
			getScores();

	}



	function saveScore() {
		global $file;

		if(isset($_POST['pseudo']) && isset($_POST['score'])) {
		    if(($_POST['pseudo'] !== '')) {

		    	
		    	$pseudo = $_POST['pseudo'];
				$score = $_POST['score'];


				$line = $pseudo . ":" . $score . ";";
				

				file_put_contents($file, $line, FILE_APPEND | LOCK_EX);

		        $reponse = 'ok';
		    } else {
		        $reponse = 'Les champs sont vides';
		    }
		} else {
		    $reponse = 'Tous les champs ne sont pas parvenus';
		}
 
		echo json_encode(['reponse' => $reponse]);
	}


	function getScores() {
		global $file;

		$fileContent = file_get_contents($file, FILE_USE_INCLUDE_PATH);

		echo json_encode(['reponse' => $fileContent ]);
	}
?>