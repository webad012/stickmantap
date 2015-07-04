<?php

function connectDb($params)
{    
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

function loginUser($db, $username, $password)
{
    $result = 'Unknown error';
    $sql1 = "SELECT count(*) as cnt from stickmantap_users WHERE username=:username AND password=:password";
    $query1 = $db->prepare($sql1);
    $query1->execute(array(
        ':username'=>$username,
        ':password'=>$password
    ));
    $row = $query1->fetch(PDO::FETCH_ASSOC);
        
    $count = $row['cnt'];
    if($count != 1)
    {
        $result = 'Wrong username and or password';
    }
    else
    {
        $result = 'success';
    }
        
    return $result;
}

function getUserData($db, $username)
{ 
    $sql1 = "SELECT username, character_name, character_level, character_coins, max_game_level, "
                . "last_action, api_url, character_game_level "
            . "FROM stickmantap_users "
            . "WHERE username=:username";
    $query1 = $db->prepare($sql1);
    $query1->execute(array(
        ':username'=>$username,
    ));
    $row = $query1->fetch(PDO::FETCH_ASSOC);
    
    $result = $row;
        
    return $result;
}

function setData($db, $username, $gameLevel, $playerCoins, 
                    $playerLevel, $maxGameLevel, $playerName, $lastAction)
{
    $result = 'success';
    
    $sql = "UPDATE stickmantap_users "
            . "SET character_game_level = :character_game_level, "
            . "character_coins = :character_coins, "
            . "character_level = :character_level, "
            . "max_game_level = :max_game_level, "
            . "character_name = :character_name, "
            . "last_action = :last_action "
            . "WHERE username = :username";
    $query = $db->prepare($sql);
    $query->execute(array(
        ':username'=>$username,
        ':character_game_level'=>$gameLevel,
        ':character_coins'=>$playerCoins,
        ':character_level'=>$playerLevel,
        ':max_game_level'=>$maxGameLevel,
        ':character_name'=>$playerName,
        ':last_action'=>$lastAction
    ));
    
    return $result;
}

function loadLeaderboards($db, $username)
{
    $leaderboard = array();
    
    $query = "SELECT @rn:=@rn+1 AS rank, username, character_name, max_game_level 
                FROM (
                        SELECT username, character_name, max_game_level 
                        FROM stickmantap_users 
                        order by max_game_level desc
                ) t1, (SELECT @rn:=0) t2;";
    $stmt = $db->query($query);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $users_position = -1;
    $count = 1;
    foreach($results as $row)
    {   
        if($row['username'] === $username)
        {
            $users_position = $row['rank'];
        }
        
        if($count <= 100)
        {
            $leaderboard[] = array(
                'character_name' => $row['character_name'],
                'max_game_level' => $row['max_game_level']
            );
        }
        
        $count++;
    }
    
    if($users_position === -1)
    {
        throw new Exception('No user found');
    }
    
    $result = array(
        'leaderboard' => $leaderboard,
        'users_position' => $users_position
    );
    
    return $result;
}