<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/include.php !!
!! This file, when included, takes all the files below and inserts them into the index. !!
Last Updated 16 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}
include('include/headers.php');
include('include/check_session.php');
include('include/functions.php');
include('include/views.php');
include('include/db_info.php');
include('include/pull.php');
include('include/version.inc.php');
include('include/rh.php');
?>