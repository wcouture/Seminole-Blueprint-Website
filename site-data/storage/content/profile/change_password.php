<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/profile/change_password.php !!
!! This file is called when the user decides to change his / her password. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}

$old_password = fix_password('oldpass');
$old_password = sha1($old_password);

$new_password = fix_password('newpass');
$new_password_confirm = fix_password('newpass2');
$query = "SELECT * FROM users WHERE id = $userid AND password = \"$old_password\"";
$results = mysql_query($query) or errormsg(mysql_error(), 'content/profile/change_password.php', __LINE__);
unset($query);
$num = mysql_num_rows($results);
if($num == 1) {
	if($new_password == $new_password_confirm && $new_password != "") {
		$new_password = sha1($new_password);
		$query = "UPDATE users SET password = \"$new_password\" WHERE id = $userid";
		mysql_query($query) or errormsg(mysql_error(), 'content/profile/change_password.php', __LINE__);
		echo "<h2>Password Successfully Changed</h2>
		Please log-off and log back on for the new password to take effect.<br />";
	} else {
		echo "<h2>Password Change Failed</h2>
		Either the two passwords you entered do not match, or they were blank.<br />";
	}
} else {
	echo '<h2>Password Change Failed</h2>
	The current password you entered was not valid.<br />';
}
?><br /><br />
<a href="?view=profile">Return to Profile</a>