<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/admin_edit_profile.php !!
!! This file is called when an Administrator chooses to edit a user's profile. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}
$user = $_POST['userid'];
$fname = fix_register_string('fname');
$lname = fix_register_string('lname');
$address = fix_register_string('address');
$city = fix_register_string('city');
$state = fix_register_string('state');
$zipcode = fix_register_string('zipcode');
$user_type = $_POST['user_type'];
$query = "UPDATE users set
	fname = \"$fname\",
	lname  = \"$lname\",
	address = \"$address\",
	city = \"$city\",
	state = \"$state\",
	zipcode = \"$zipcode\",
	user_type = \"$user_type\"
WHERE id = $user";
mysql_query($query) or errormsg(mysql_error(), 'include/admin_edit_profile.php', __LINE__);
?>
<script language="javascript" type="text/javascript">
alert("Settings Saved Successfully");
</script>
