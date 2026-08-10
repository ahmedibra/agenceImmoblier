<?php
$target = '../storage/app/public';
$link = 'storage';
if (file_exists($link)) {
    echo "Le lien existe déjà, suppression...";
    unlink($link);
}
if (symlink($target, $link)) {
    echo "Lien symbolique relatif créé avec succès !";
} else {
    echo "Erreur lors de la création du lien : " . error_get_last()['message'];
}
?>
