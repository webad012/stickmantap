<?php

include('conf.php');

$action = filter_input(INPUT_GET, 'action');
$callback = filter_input(INPUT_GET, 'callback');
$data = '{}';

if(isset($callback))
{
    $host = $params['dbhost'];
    $port = $params['dbport'];
    $dbname = $params['dbname'];
    $credentials = $params['dbcredentials'];
            
    $db = pg_connect( "$host $port $dbname $credentials"  );
    if(!$db)
    {
        throw new Exception('error in accessing database');
    }
    
    header('Content-Type: text/javascript; charset=utf8');
    header('Access-Control-Allow-Origin: http://www.milosjankovic.com/');
    header('Access-Control-Max-Age: 3628800');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

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
        header('Content-Type: application/json; charset=utf8');
        echo $data;
    }
    
    pg_close($db);
}
else
{
    $data = '{"status":"failure","message":"bad action1"}';
    header('Content-Type: application/json; charset=utf8');
    echo $data;
}

function getCurrentVersionNum($db)
{
    $sql =<<<EOF
        SELECT value from conf_data WHERE name='current_version';
EOF;

    $ret = pg_query($db, $sql);
    if(!$ret){
        throw new Exception('error in getting data from database');
    }
    $row = pg_fetch_row($ret);

    $current_version = $row[0];
    
    return $current_version;
}

function getDownloadUrl($db)
{
    $sql =<<<EOF
        SELECT value from conf_data WHERE name='download_url';
EOF;

    $ret = pg_query($db, $sql);
    if(!$ret){
        throw new Exception('error in getting data from database');
    }
    $row = pg_fetch_row($ret);

    $download_url = $row[0];
    
    return $download_url;
}

