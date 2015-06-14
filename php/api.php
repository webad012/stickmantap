<?php

//ini_set('error_reporting', E_ALL|E_STRICT);
//ini_set('display_errors', 1);

include('conf.php');
include('mysqldb.php');

$action = filter_input(INPUT_GET, 'action');
$callback = filter_input(INPUT_GET, 'callback');
$data = '{}';

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

        $data = '{"status":"success","gameVersion":'.$current_version.',"downloadUrl":"'.$download_url.'"}';
        echo $callback.'('.$data.');';
    }
    else
    {
        $data = '{"status":"failure","message":"bad action2"}';
        echo $callback.'('.$data.');';
    }
    
    closeDb($db);
}
else
{
    $data = '{"status":"failure","message":"bad action1"}';
    echo $data;
}
