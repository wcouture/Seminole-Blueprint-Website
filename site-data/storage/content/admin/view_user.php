<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/view_user.php !!
!! This file is a part of the Administrator panel. It allows an Administrative user the option of viewing the profile of any active user account. !!
Last Updated 13 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../../');
}
if($user_type == 1) {
	if($_POST['fname']) {
		include_once('include/admin_edit_profile.php');
	} else {
		$user = $_GET['user'];
	}
	$query = "SELECT * FROM users WHERE id = $user";
	$results = mysql_query($query) or errormsg(mysql_error(), 'content/admin/view_user.php', __LINE__);
	$user_exists = mysql_num_rows($results);
//	echo "User Exists: $user_exists";
	if($user_exists != 0) {
		$user['id'] = $user;
		if($user == $userid) {
			$is_me = 1;
		} else {
			$is_me = 0;
		}
		$user = mysql_fetch_array($results);
		?>
		<h2>View User <?=$user['username']; ?></h2><br />
		<table width="100%">
		<tr>
		<td>
		<form name="user_profile" action="" method="post">
		<h3>Personal Information</h3>
		<label for="fname">First Name:</label><br />
		<input type="text" name="fname" value="<?=$user['fname']; ?>" />
		<br>
		<br />
		<label for="lname">Last Name:</label><br />
		<input type="text" name="lname" value="<?=$user['lname']; ?>" />
		<br>
		<br />
		<label for="address">Address:</label><br />
		<input type="text" name="address" value="<?=$user['address']; ?>" />
		<br>
		<br />
		<label>City / State / Zipcode:</label><br />
		<input type="text" name="city" value="<?=$user['city']; ?>"><input type="text" name="state" size="4" value="<?=$user['state']; ?>" /><input type="text" name="zipcode" size="10" value="<?=$user['zipcode']; ?>" />
		<br>
		<br />
		Last Logged In:<br />
		<?=$user['last_logon']; ?>
		<br>
		<br />
		<label for="user_type">User Level:</label>
		<br />
		<select name="user_type" onchange="checkforadmin(<?=$user['user_type']; ?>,this.value);">
			<option value="0">Regular User</option>
			<option value="1"<? if($user['user_type'] == 1) echo ' selected'; ?>>Admin User</option>
		</select><br />
		<input type="hidden" name="userid" value="<?=$user['id']; ?>" />
		<input type="submit" value="Save Changes" onclick="savechanges();">
		</form></td>
		<td width="50%" valign="top">
        
        <form action="javascript:changepw();" name="change_pw">
		<h3>Change <?=$user['username']; ?>'s Password:</h3>
		<label for="newpw">New Password:</label><br />
		<input type="text" name="newpw"><br />
        <input type="hidden" name="userid" value="<?=$user['id']; ?>" />
		<input type="submit" value="Change Password"></form>
		</td>
		</tr>
		<td colspan="2" align="center"><h3><?=$user['username']; ?>'s 500 Most Recent Files</h3>
		<?php
		$query = "SELECT id, date_uploaded, filename FROM files WHERE owner = $user[id] ORDER BY id DESC LIMIT 500";
		$results = mysql_query($query) or errormsg(mysql_error(), 'content/admin/view_user.php', __LINE__);
		$user_files = mysql_num_rows($results);
		?>
		<form name="del_files" action="?view=admin_delete_files&amp;user=<?=$user['id']; ?>" method="post">
		<table width="100%">
		<tr>
		<td>File Name</td>
		<td>Uploaded On</td>
		<td>Delete</td>
		</tr>
		<?php
		if($user_files) {
			while($working_object = mysql_fetch_object($results)) {
			echo '<tr>
			<td><a href="?view=viewfile&amp;file=', $working_object -> id, '" target="_blank">', $working_object -> filename, '</a></td>
			<td>' . $working_object -> date_uploaded . '</td>
			<td><input type="checkbox" name="delete[]" value="', $working_object -> id, '"></td>
			</tr>
			';
			}
			echo '<tr>
				<td colspan="3"><input type="submit" value="Submit Changes"></td>
			</tr>';
		} else {
			echo '<tr>
				<td colspan="3"><b>', $user['username'], ' has no files.</b></td>
			</tr>';
		}
		?>
		</table>
		</form>
		</td>
		</table>
		<a href="?view=manage_users">&lt;-- Go Back</a>
		<script language="javascript" type="text/javascript">
		var admin_function = false;
			function changepw() {
				var x = false;
				x = confirm("Really Change <?=$fname, " ", $lname; ?>'s Password?\nThis action is not reversable.");
				if(x) {
					document.change_pw.action = "?view=admin_change_password";
					document.change_pw.method = "post";
					document.change_pw.submit;
				}
			}
			function checkforadmin(oldvalue,newvalue) {
				var theform = document.user_profile;
				var theobject = theform.user_type;
				if((oldvalue != newvalue) && (admin_function == false)) {
					if((oldvalue == 1) && (newvalue == 0)) {
						var x = change_text('an administrator to a limited user');
						if(! x) {
							theobject.value = 1;
							return false;
						} else {
							admin_function = true;
						}
					} else {
						var x = change_text('a limited user to an administrator');
						if(! x) {
							theobject.value = 0;
							return false;
						} else {
							admin_function = true;
						}
					}
				}
				return false;
			}
						
			function change_text(from_to) {
				var x = confirm("You are about to change this user's level from " + from_to + ".\nAre you sure you want to continue?");
				return x;
			}
		</script>
		<?php
	} else {
		?>
		<h3>User Does Not Exist</h3>
		The user ID could not be found in the database.<br />
		<a href="?view=manage_users">&lt;-- Go Back</a>
		<?php
	}
} else {
	include_once('include/no_admin.php');
}
?>
<br /><br />
