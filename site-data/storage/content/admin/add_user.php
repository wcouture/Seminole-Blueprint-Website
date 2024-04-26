<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/add_user.php !!
!! This file is part of the Administrator panel. It is used to begin adding a user into the system. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
if($user_type == 1) {
$username = fix_register_string('username');

$fname = fix_register_string('fname');
$lname = fix_register_string('lname');
$address = fix_register_string('address');
$city = fix_register_string('city');
$state = fix_register_string('state');
$zipcode = fix_register_string('zipcode');
$user_type = fix_register_string('user_type');

if($username) {
	if($_POST['password']) {
		$password = fix_register_string('password');
		$password = sha1($password);
		$query = "INSERT INTO users (
			username,
			fname,
			lname,
			address,
			city,
			state,
			zipcode,
			user_type
		) VALUES (
			\"$username\",
			\"$fname\",
			\"$lname\",
			\"$address\",
			\"$city\",
			\"$state\",
			\"$zipcode\",
			\"$user_type\"
		)";
		mysql_query($query) or errormsg(mysql_error(), 'content/admin/add_user.php', __LINE__);
		echo '<h2>User Successfully Added</h2>
		User ', $username, ' successfully created.';
	} else {
		echo '<h2>Account Creation Failed</h2>
		We are sorry, but all accounts must have a password.';
	}
} else {
	echo '<h2>Account Creation Failed</h2>
	We are sorry, but all accounts must have a username.';
}
?>
<script language="javascript" type="text/javascript">
setTimeout('users()',3000);
function users() {
	location.href = "?view=admin_add_user";
}
</script>
<br /><br />
<a href="?view=admin_add_user">Add User Screen</a>
<?php
} else {
	include_once('include/noadmin.php');
}