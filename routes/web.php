<?php

foreach (glob(__DIR__.'/web/*', GLOB_ONLYDIR) as $dir) {
    $filePath = $dir.'/index.php';
    if (file_exists($filePath)) {
        require_once $filePath;
    }
}
