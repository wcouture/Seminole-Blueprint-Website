<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/pull.php !!
!! This file is the workhouse of the program. It pulls all the information out of the database and inserts the data into variables. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}

$query = "SELECT * FROM `settings` WHERE const = 1";
$db1 = mysql_query($query) or errormsg(mysql_error(), "include/pull.php", __LINE__, "Query");
$working_array = mysql_fetch_array($db1) or errormsg(mysql_error(), "include/pull.php", __LINE__, "fetch object");
$maintitle = $working_array['title'];
$subtitle = $working_array['subtitle'];
$logonheader = $working_array['logon_header'];
$logontext = $working_array['logon_text'];
$registerheader = $working_array['register_header'];
$registertext = $working_array['register_text'];
$regsuccessheader = $working_array['register_success_header'];
$regsuccesstext = $working_array['register_success_text'];
$logoffheader = $working_array['logoff_header'];
$logofftext = $working_array['logoff_text'];
$public_reg = $working_array['public_reg'];
$allowed_types = $working_array['allowed_types'];
$allowed_types_array = explode(" " , $allowed_types);
$max_size = $working_array['max_size'];
$max_size_kb = round($max_size / 1024,0);
$max_num_files = $working_array['max_num_files'];
$public_edit_profile = $working_array['public_edit_profile'];
unset($working_array, $db1, $query);

if($userid != "") {
	$query = "SELECT * FROM `users` WHERE id = $userid";
	$results = mysql_query($query) or errormsg(mysql_error(), "include/pull.php", __LINE__, "Query");
	$working_object = mysql_fetch_object($results);
	$password = $working_object -> password;
	$fname = $working_object -> fname;
	$lname = $working_object -> lname;
	$address = $working_object -> address;
	$city = $working_object -> city;
	$state = $working_object -> state;
	$zip = $working_object -> zipcode;
	$last_logon = $working_object -> last_logon;
	$user_type = $working_object -> user_type;
	unset($query, $results, $working_object);
	
	$query = "SELECT * FROM files WHERE owner = $userid ORDER BY id DESC";
	$files_query = mysql_query($query) or errormsg(mysql_error(), "include/pull.php",__LINE__, "Query");
	$num_of_files = mysql_num_rows($files_query);
	unset($query);

}
		
?>