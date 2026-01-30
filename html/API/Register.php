<?php

    $inData = getRequestInfo();

    $firstName = $inData["firstName"] ?? "";
    $lastName  = $inData["lastName"] ?? "";
    $login     = $inData["login"] ?? "";
    $password  = $inData["password"] ?? "";

    if($firstName == "" || $lastName == "" || $login == "" || $password == "")
    {
        returnWithError("Missing required fields");
        exit();
    }

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if($conn->connect_error)
    {
        returnWithError($conn->connect_error);
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();

        if($result->fetch_assoc())
        {
            $stmt->close();
            $conn->close();
            returnWithError("User already exists");
            exit();        
        }
        $stmt->close();

        $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName, Login, Password) VALUES (?,?,?,?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);

        if($stmt->execute())
        {
            $newId = $stmt->insert_id;
            returnWithInfo($firstName, $lastName, $newId);
        }
        else
        {
            returnWithError("Failed to register user");
        }
        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $firstName, $lastName, $id )
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultInfoAsJson( $retValue );
    }

?>