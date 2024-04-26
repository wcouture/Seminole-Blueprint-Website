<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/change_password.php !!
!! This file is part of the Administrator panel. It is used to change a user's password if it is forgotten. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
if($user_type == 1) {
	if($_POST) {
		$id = fix_register_string('userid');
		$pass = fix_password('newpw');
		$pass = sha1($pass);
		
		$query = "SELECT fname, lname FROM users WHERE id = \"$id\"";
		$results = mysql_query($query) or errormsg(mysql_error(), 'content/admin/change_password.php', __LINE__);
		unset($query);
		$num = mysql_num_rows($results);
		if($num) {
			$results = mysql_fetch_object($results);
			$fname = $results -> fname;
			$lname = $results -> lname;
			unset($results);
			$query = "UPDATE users SET password = \"$pass\" WHERE id = \"$id\"";
			mysql_query($query) or errormsg(mysql_error(), 'content/admin/change_password.php', __LINE__);
			echo '<h2>Password Changed Successfully</h2>
			You have successfully changed ', $fname, ' ', $lname, "'s password.";
		} else {
			echo '<h2>Error Changing Password</h2>
			The User ID that was submitted could not be found in the database.';
		}
	
	} else {
		echo '<h2>Error Changing Password</h2>
		You did not access this page using the change password form.';
	}

} else {
	include_once('include/noadmin.php');
}
?>
<a href="javascript:history.go(-1);">Go Back</a>