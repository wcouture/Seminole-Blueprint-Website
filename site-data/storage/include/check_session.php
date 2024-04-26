<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/check_session.php !!
!! This file checks to see if a user is logged in. If so, it creates the variable "userid." !!
Last Updated 16 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}
$view = $_GET['view'];
$view = strtolower($view);
$view = htmlspecialchars($view);
if($db['error']) {
	$view = "dberror";
} else if(! $_SESSION['bkwuploader'] && $view != "register" && $view != "process_register" && $view != "rh" && $view != "dberror") {
	$view = "logon";
} else {
	$userid = $_SESSION['bkwuploader'];
}
?>