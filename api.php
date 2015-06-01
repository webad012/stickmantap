<?php

$db_params = array(
    'host'        => "host=localhost",
    'port'        => "port=5432",
    'dbname'      => "dbname=stickmantap",
    'credentials' => "user=postgres password=postgres",
);

$action = filter_input(INPUT_GET, 'action');
$callback = filter_input(INPUT_GET, 'callback');
$data = '{}';

if(isset($callback))
{
    header('Content-Type: text/javascript; charset=utf8');
    header('Access-Control-Allow-Origin: http://www.milosjankovic.com/');
    header('Access-Control-Max-Age: 3628800');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    
    if($action == 'GetCurrentVersion')
    {
        $data = '{"status":"success"}';
        echo $callback.'('.$data.');';
    }
    else
    {
        $data = '{"status":"failure","message":"bad action"}';
        header('Content-Type: application/json; charset=utf8');
        echo $data;
    }
}
else
{
    $data = '{"status":"failure","message":"bad action"}';
    header('Content-Type: application/json; charset=utf8');
    echo $data;
}

