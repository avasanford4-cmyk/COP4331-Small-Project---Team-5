<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// First, check what records would be affected
		$checkStmt = $conn->prepare("SELECT ID, FirstName, LastName, EmailAddress, PhoneNumber FROM Contacts WHERE (ID = ?) AND (UserID = ?)");
		$checkStmt->bind_param("ii", $inData["id"], $inData["userId"]);
		$checkStmt->execute();
		$result = $checkStmt->get_result();
		
		$searchResults = "";
		$searchCount = 0;
		
		// Build the results from what will be deleted
		while($row = $result->fetch_assoc())
		{
			if( $searchCount >= 1 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"id":' . $row["ID"] . ',"firstName":"' . $row["FirstName"] . '", "lastName":"' . $row["LastName"] . '", "email":"' . $row["EmailAddress"] . '", "phone":"' . $row["PhoneNumber"] . '"}';
		}
		
		$checkStmt->close();
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else if( $searchCount > 1 )
		{
			// Multiple records found - return error but still show what would be deleted
			$retValue = '{"Multiple Matches":[' . $searchResults . '],"error":"Multiple records found - batch deletion not allowed"}';
			sendResultInfoAsJson( $retValue );
		}
		else
		{
			// Exactly one record found - proceed with deletion
			$deleteStmt = $conn->prepare("DELETE FROM Contacts WHERE (ID = ?) AND (UserID = ?)");
			$deleteStmt->bind_param("ii", $inData["id"], $inData["userId"]);
			$deleteStmt->execute();
			
			// Check if deletion was successful
			if($deleteStmt->affected_rows > 0)
			{
				returnWithInfo( $searchResults );
			}
			else
			{
				returnWithError( "Failed to delete record" );
			}
			
			$deleteStmt->close();
		}
		
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"Deleted Contact":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>