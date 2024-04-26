<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/create_user.php !!
!! This file is part of the Administrator panel. It is used to enter a new user into the system.  !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../...');
	die('');
}

if($user_type == 1) {
?>
<h2>Create A New User</h2>
To create a new user, please fill out the form below.<br /><br />
<form action="?view=create_new_user" method="post" name="new_user_form">
<label for="username">Username:</label><br />
<input type="text" name="username" /><br  />

<label for="password">Password:</label><br />
<input type="text" name="password" /><br />

<label for="fname">First Name:</label><br />
<input type="text" name="fname" /><br />

<label for="lname">Last Name:</label><br />
<input type="text" name="lname" /><br />

<label for="address">Address:</label><br />
<input type="text" name="address" /><br />

<label for="city">City / State / Zipcode:</label><br />
<input type="text" name="city" size="25" /><input type="text" name="state" size="3" /><input type="text" name="zipcode" size="11" /><br />

<label for="user_type">User Type:</label><br />
<select name="user_type" onChange="checkforadmin(this.value);">
	<option value="0">Regular User</option>
	<option value="1">Admin User</option>
</select><br />
<input type="submit" value="Add User" />
<br /><br />
<a href="?view=manage_users">User Control Panel</a>
</form>
<script language="javascript" type="text/javascript">
function checkforadmin(user_type) {
	if(user_type == 1) {
		var x = confirm("Warning: Admin users have full access to this software, just as you do.\nThis user will be able to change any setting and / or delete any files or users.\nAre you sure you want to continue?");
		if(! x) {
			document.new_user_form.user_type.value = 0;
		}
	}
}
</script>
<?php
} else {
	include_once('include/noadmin.php');
}
?>