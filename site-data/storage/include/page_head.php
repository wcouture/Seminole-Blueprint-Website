<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/page_head.php !!
!! This file is called by the Index page. Content here is inserted into the <head> tags. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}
?>
<title><?=$maintitle, " - ", $title; ?></title>
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
<meta name="author" content="BKWorks Products, A Freeware / Donationware Comapny" />
<link rel="stylesheet" href="style.css" type="text/css" media="screen" />