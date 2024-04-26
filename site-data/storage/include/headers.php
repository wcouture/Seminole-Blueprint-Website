<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/headers.php !!
!! This file sends out "DO NOT CACHE" headers to the browser. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}


header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past


?>