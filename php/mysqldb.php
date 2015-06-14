<?php

function connectDb($params)
{
    error_log(__METHOD__.' - 1');
    
    $mysql_host = $params['dbhost'];
    $mysql_user = $params['dbusername'];
    $mysql_password = $params['dbpassword'];
    $my_database = $params['dbname'];
    
    $db = new PDO('mysql:host='.$mysql_host.';dbname='.$my_database.';charset=utf8', 
                    $mysql_user, 
                     $mysql_password, 
                    array(PDO::ATTR_EMULATE_PREPARES => false, 
                            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    
    return $db;
}

function closeDb($db)
{
    $db = null;
}

function getCurrentVersionNum($db)
{
    $query = "SELECT value from stickmantap_config WHERE name='current_version'";
    $stmt = $db->query($query);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $result = $row['value'];
    return $result;
}

function getDownloadUrl($db)
{
    $query = "SELECT value from stickmantap_config WHERE name='download_url'";
    $stmt = $db->query($query);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $result = $row['value'];
    return $result;
}

function registerUser($db, $username, $password, $lastaction)
{
    $sql1 = "SELECT count(*) as cnt from stickmantap_users WHERE username=:username";
    $query1 = $db->prepare($sql1);
    $query1->execute(array(
        ':username'=>$username
    ));
    $row = $query1->fetch(PDO::FETCH_ASSOC);
    $count = $row['cnt'];
    if($count > 0)
    {
        return 'Username taken';
    }
    
    $sql2 = "INSERT INTO stickmantap_users (username, password, character_name, character_level, character_coins, "
                                            . "max_game_level, last_action, api_url, character_game_level) "
            . "VALUES (:username, :password, :character_name, :character_level, :character_coins, "
                    . ":max_game_level, :last_action, :api_url, :character_game_level)";
//                    . ":max_game_level, :last_action, :api_url)";
    $query2 = $db->prepare($sql2);
    $query2->execute(array(
        ':username'=>$username,
        ':password'=>$password,
        ':character_name'=>$username,
        ':character_level'=>1,
        ':character_coins'=>0,
        ':max_game_level'=>1,
        ':last_action'=>$lastaction,
        ':api_url'=>'',
        ':character_game_level'=>1
    ));
    
    return 'success';
}