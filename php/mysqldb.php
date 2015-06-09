<?php

function connectDb($params)
{
    error_log(__METHOD__.' - 1');
    
    $mysql_host = $params['dbhost'];
    $mysql_user = $params['dbusername'];
    $mysql_password = $params['dbpassword'];
    $my_database = $params['dbname'];
    
////    error_log(__METHOD__.' - 2');
//    
//    // Create connection
////    $db = mysql_connect($mysql_host, $mysql_user, $mysql_password);
//    
////    error_log(__METHOD__.' - 3');
//
//    // Check connection
////    if (!$db) {
////        die("Connection failed: " . mysqli_connect_error());
////    }
//    
////    error_log(__METHOD__.' - 4');
//    
////    // Connecting, selecting database
//    $db = mysql_connect($mysql_host, $mysql_user, $mysql_password)
//        or die('Could not connect: ' . mysql_error());
////    echo 'Connected successfully';
//    mysql_select_db($my_database) or die('Could not select database');
////    mysql_select_db($my_database, $db) or die('Could not select database');
//    
////    error_log(__METHOD__.' - 5');
    
    $db = new PDO('mysql:host='.$mysql_host.';dbname='.$my_database.';charset=utf8', 
                    $mysql_user, 
                     $mysql_password, 
                    array(PDO::ATTR_EMULATE_PREPARES => false, 
                            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    
    return $db;
}

function closeDb($db)
{
//    mysql_close($db);
    $db = null;
}

function getCurrentVersionNum($db)
{
    $query = "SELECT value from stickmantap_config WHERE name='current_version'";
//    $result = mysql_query($query, $db) or die('Query failed: ' . mysql_error());
    $stmt = $db->query($query);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $result = $row['value'];
    return $result;
}

function getDownloadUrl($db)
{
    $query = "SELECT value from stickmantap_config WHERE name='download_url'";
//    $result = mysql_query($query, $db) or die('Query failed: ' . mysql_error());
    $stmt = $db->query($query);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $result = $row['value'];
    return $result;
}