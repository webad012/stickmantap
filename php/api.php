<?php

//ini_set('error_reporting', E_ALL|E_STRICT);
//ini_set('display_errors', 1);

include('conf.php');
include('mysqldb.php');

$action = filter_input(INPUT_GET, 'action');
$callback = filter_input(INPUT_GET, 'callback');
$data = array();

header('Content-Type: text/javascript; charset=utf8');
header('Access-Control-Allow-Origin: http://www.milosjankovic.com/');
header('Access-Control-Max-Age: 3628800');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

if(isset($callback))
{
    $db = connectDb($params);
        
    if($action == 'GetCurrentVersion')
    {
        $current_version = getCurrentVersionNum($db);
        $download_url = getDownloadUrl($db);

        $data['status'] = 'success';
        $data['gameVersion'] = $current_version;
        $data['downloadUrl'] = $download_url;
        $data = json_encode($data);
//        $data = actionGetCurrentVersion($db);
        
        echo $callback.'('.$data.');';
    }
    else if($action == 'Register')
    {
        $username = filter_input(INPUT_GET, 'username');
        $password = md5(filter_input(INPUT_GET, 'password'));
        $lastaction = filter_input(INPUT_GET, 'lastaction');
        
        $message = registerUser($db, $username, $password, $lastaction);
        
        $data['status'] = 'success';
        $data['message'] = $message;
        $data = json_encode($data);
        echo $callback.'('.$data.');';
    }
    else if($action == 'Login')
    {
        $username = filter_input(INPUT_GET, 'username');
        $password = md5(filter_input(INPUT_GET, 'password'));
        
        $message = loginUser($db, $username, $password);
        $user_data = '';
        $leaderboards_data = '';
        if($message === 'success')
        {
            $user_data = getUserData($db, $username);
            $leaderboards_data = loadLeaderboards($db, $username);
        }
        
        $data['status'] = 'success';
        $data['message'] = $message;
        $data['user_data'] = $user_data;
        $data['leaderboards_data'] = $leaderboards_data;
        $data = json_encode($data);
        
        echo $callback.'('.$data.');';
    }
    else if($action == 'SetData')
    {
        $username = filter_input(INPUT_GET, 'username');
        $gameLevel = filter_input(INPUT_GET, 'gameLevel');
        $playerCoins = filter_input(INPUT_GET, 'playerCoins');
        $playerLevel = filter_input(INPUT_GET, 'playerLevel');
        $maxGameLevel = filter_input(INPUT_GET, 'maxGameLevel');
        $playerName = filter_input(INPUT_GET, 'playerName');
        $lastAction = filter_input(INPUT_GET, 'lastAction');
        
        $message = setData($db, $username, $gameLevel, $playerCoins, 
                $playerLevel, $maxGameLevel, $playerName, $lastAction);
        
        $data['status'] = 'success';
        $data['message'] = $message;
        $data = json_encode($data);
        
        echo $callback.'('.$data.');';
    }
    else if($action == 'LoadLeaderboards')
    {
        $username = filter_input(INPUT_GET, 'username');
        
        $message = loadLeaderboards($db, $username);
        
        $data['status'] = 'success';
        $data['message'] = $message;
        $data = json_encode($data);
        
        echo $callback.'('.$data.');';
    }
    else
    {
        $data['status'] = 'failure';
        $data['message'] = "bad action2";
        $data = json_encode($data);
        echo $callback.'('.$data.');';
    }
    
    closeDb($db);
}
else
{
    $data['status'] = 'failure';
    $data['message'] = "bad action1";
    $data = json_encode($data);
    echo $data;
}

//function actionGetCurrentVersion($db)
//{    
//    $current_version = getCurrentVersionNum($db);
//    $download_url = getDownloadUrl($db);
//
//    $data['status'] = 'success';
//    $data['gameVersion'] = $current_version;
//    $data['downloadUrl'] = $download_url;
//    $data = json_encode($data);
//    
//    return $data;
//}
//
//function actionRegister($db)
//{    
//    $username = filter_input(INPUT_GET, 'username');
//    $password = md5(filter_input(INPUT_GET, 'password'));
//    $lastaction = filter_input(INPUT_GET, 'lastaction');
//
//    $message = registerUser($db, $username, $password, $lastaction);
//
//    $data['status'] = 'success';
//    $data['message'] = $message;
//    $data = json_encode($data);
//    
//    return $data;
//}
