<?php
$target = '../storage/app/public';
$link = 'storage';
if (symlink($target, $link)) {
    echo 'OK';
} else {
    echo 'Erreur : ' . error_get_last()['message'];
}
