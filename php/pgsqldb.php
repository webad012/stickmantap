<?php

function connectDb($params)
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
    
    return $db;
}

function closeDb($db)
{
    pg_close($db);
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