<?php
	
	if(isset($_POST["Name"])) {
	
		$email = $_POST["Email"];
		$to="lucas@lucasmforde.co.uk, lucasmforde@gmail.com";
		$subject="LUCASMFORDE.CO.UK ENQUIRY";
		$from = stripslashes($email);
		$headers = "From: $from\r\n";
		
		foreach($_POST as $field => $value) {
			$body .= sprintf("%s: %s\n", $field, $value);
		}
		
		if (mail($to, $subject, $body, $headers)) {
			$result = array(
				"response" => array(
					"status" => "success",
					"message" => "Success"
				)
			);
		} else {
			$result = array(
				"response" => array(
					"status" => "fail",
					"message" => "Error, send failed."
				)
			);
		}

		echo json_encode($result);

	}

?>