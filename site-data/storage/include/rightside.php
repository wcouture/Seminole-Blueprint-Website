<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/rightside.php !!
!! This file determines which toolbar should be displayed on the right side, depending on whether or not the user has logged in. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}
if($userid) {
	include_once('include/rightside/loggedin.php');
} else {
	include_once('include/rightside/logon.php');
}
?>