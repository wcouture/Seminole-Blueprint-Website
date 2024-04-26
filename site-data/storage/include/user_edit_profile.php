<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/user_edit_profile.php !!
!! This file is called by the profile page in 'content.' It is called when the user changes their profile. This file was created to help relieve the amount of code required in one file. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}
$fname = fix_register_string('fname');
$lname = fix_register_string('lname');
$address = fix_register_string('address');
$city = fix_register_string('city');
$state = fix_register_string('state');
$zip = fix_register_string('zip');

$query = "UPDATE users SET 
	fname = \"$fname\",
	lname = \"$lname\",
	address = \"$address\",
	city = \"$city\",
	state = \"$state\",
	zipcode = \"$zip\"
WHERE id = $userid";
mysql_query($query) or errormsg(mysql_error(), 'include/user_edit_profile', __LINE__);
?>
<script language="javascript" type="text/javascript">
<!-- 
alert('Settings Saved Successfully.');
// -->
</script>