<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/functions.php !!
!! This file contains the "fix string" functions used for registrations and uploads. !!
Last Updated 17 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}

function errormsg($error_message, $file, $line, $method="Query") {
	die("Can't " . $method . " in file " . $file . " on line " . $line . "<br />MySQL Reported: " . $error_message);
}

function fix_string($string_to_fix) {
	$string_to_fix = str_replace('(','-',$string_to_fix);
	$string_to_fix = str_replace(')','-',$string_to_fix);
	$string_to_fix = str_replace('"',"-",$string_to_fix);
	return $string_to_fix;
}

function fix_register_string($string_to_post) {
	$return_string = $_POST[$string_to_post];
	$return_string = fix_string($return_string);
	$return_string = stripslashes(htmlspecialchars($return_string));
	return $return_string;
}

function fix_password($string_to_fix) {
	$return_string = $_POST["$string_to_fix"];
	$return_string = fix_string($return_string);
	$return_string = stripslashes(htmlspecialchars($return_string));
	return $return_string;
}
?>
