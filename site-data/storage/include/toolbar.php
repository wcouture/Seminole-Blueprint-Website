<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/toolbar.php !!
!! This file determins what toolbar to show on top, determined by whether or not the user is logged in. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}

if($userid) {
	include_once('include/toolbars/loggedin.php');
} else {
	include_once('include/toolbars/login.php');
}
?>