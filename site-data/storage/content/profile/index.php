<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/profile/index.php !!
!! This file is used to show the user their current profile, and, if allowed, the ability to change it. !!
Last Updated 7 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
$edit = ($public_edit_profile == 0);
if(!$edit && $_POST) {
	include_once('include/user_edit_profile.php');
}
unset($public_edit_profile);
?>
<h2>Profile</h2>
<table width="100%" height="300">
<tr>
<form action="" method="post">
<td valign="top">
<b>Personal Information:</b><br />
<label for="fname">First Name:</label><br />
<input type="text" name="fname" value="<?=$fname; ?>" <?php if($edit) echo 'readonly '; ?>/><br />
<label for="lname">Last Name:</label><br />
<input type="text" name="lname" value="<?=$lname; ?>" <?php if($edit) echo 'readonly '; ?>/><br />
<label for="address">Address:</label><br />
<input type="text" name="address" value="<?=$address; ?>" <?php if($edit) echo 'readonly '; ?>/><br  />
<label for="city">City:</label><br />
<input type="text" name="city" value="<?=$city; ?>" <?php if($edit) echo 'readonly '; ?> /><br />
<label for="state">State:</label><br />
<input type="text" name="state" value="<?=$state; ?>" <?php if($edit) echo 'readonly '; ?>/><br />
<label for="zip">Zip / Postal Code:</label><br />
<input type="text" name="zip" value="<?=$zip; ?>" <?php if($edit) echo 'readonly '; ?>/><br />
<input type="submit" value="Update Profile" <?php if($edit) echo 'disabled '; ?>/><br />
<?php if($edit) echo "<b>The system administrator has disabled updating your profile.<br />For more information, please contact whomever operates this software."; ?>
</td></form>
<form action="?view=change_password" method="post" name="changepw">
<td width="50%" valign="top">
<b>Change Password:</b><br />
<br />
<div id="encpw"><a href="javascript:showpw()">Click Here to Show Encrypted Password</a></div>
<br />
<br />
<label for="oldpass">Old Password:</label><br />
<input type="password" name="oldpass" /><br />
<label for="newpass">New Password:</label><br />
<input type="password" name="newpass" /><br />
<label for="newpass2">Confirm:</label><br />
<input type="password" name="newpass2" /><br />
<input type="submit" value="Change Password" />
</td></form>
</tr>
</table>
<script language="javascript" type="text/javascript">
function showpw() {
	document.getElementById('encpw').innerHTML = 'Your password, encrypted, is<br /><?=$password; ?>';
}
</script>