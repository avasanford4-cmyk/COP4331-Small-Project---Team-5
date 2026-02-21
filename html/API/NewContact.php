<?php
	header('Access-Control-Allow-Origin: http://tropicaltravels.info');
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Allow-Headers: Content-Type');

	if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
		http_response_code(200);
		exit(0);
	}

	$inData = getRequestInfo();
	
	if (!isset($inData["FirstName"]) || !isset($inData["LastName"]) || 
        !isset($inData["UserId"]) || !isset($inData["EmailAddress"]) || 
        !isset($inData["PhoneNumber"])) {
        returnWithError("Missing required fields");
        exit;
    }

	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$userId = $inData["UserId"];
	$emailAddress = $inData["EmailAddress"];
	$phoneNumber = $inData["PhoneNumber"];
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId, FirstName, LastName, PhoneNumber, EmailAddress) VALUES(?,?,?,?,?)");
		$stmt->bind_param("issss", $userId, $firstName, $lastName, $phoneNumber, $emailAddress);

		if ($stmt->execute()) {
			$stmt->close();
			$conn->close();
			returnWithError("");
		} else {
			$error = $stmt->error;
			$stmt->close();
			$conn->close();
			returnWithError($error);
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>