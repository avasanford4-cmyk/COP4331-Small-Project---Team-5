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
        // First, check that the record exists and belongs to the user
        $checkStmt = $conn->prepare("SELECT ID, FirstName, LastName, EmailAddress, PhoneNumber FROM Contacts WHERE (ID = ?) AND (UserID = ?)");
        $checkStmt->bind_param("ii", $inData["id"], $inData["userId"]);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        $searchResults = "";
        $searchCount = 0;
        
        // Build the results from what will be updated
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
            // Multiple records found - return error
            $retValue = '{"Multiple Matches":[' . $searchResults . '],"error":"Multiple records found - update not allowed"}';
            sendResultInfoAsJson( $retValue );
        }
        else
        {
            // Exactly one record found - proceed with update
            $updateStmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, EmailAddress = ?, PhoneNumber = ? WHERE (ID = ?) AND (UserID = ?)");
            $updateStmt->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phone"], $inData["id"], $inData["userId"]);
            $updateStmt->execute();
            
            // Check if update was successful
            if($updateStmt->affected_rows > 0)
            {
                // Get the updated record to return
                $updatedStmt = $conn->prepare("SELECT ID, FirstName, LastName, EmailAddress, PhoneNumber FROM Contacts WHERE (ID = ?) AND (UserID = ?)");
                $updatedStmt->bind_param("ii", $inData["id"], $inData["userId"]);
                $updatedStmt->execute();
                $updatedResult = $updatedStmt->get_result();
                
                $updatedRecord = "";
                if($row = $updatedResult->fetch_assoc())
                {
                    $updatedRecord = '{"id":' . $row["ID"] . ',"firstName":"' . $row["FirstName"] . '", "lastName":"' . $row["LastName"] . '", "email":"' . $row["EmailAddress"] . '", "phone":"' . $row["PhoneNumber"] . '"}';
                }
                
                $updatedStmt->close();
                returnWithInfo( $updatedRecord );
            }
            else
            {
                returnWithError( "Failed to update record" );
            }
            
            $updateStmt->close();
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
        $retValue = '{"Updated Contact":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>