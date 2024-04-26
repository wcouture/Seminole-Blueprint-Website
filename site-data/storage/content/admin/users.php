<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/users.php !!
!! This file is part of the Administrtor panel. It allows an Administrative user to view all active users currently enrolled in the system. !!
Last Updated 14 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../..');
	die('');
}
if($user_type == 1) {
$query = "SELECT * FROM users ORDER BY username";
$results = mysql_query($query) or errormsg(mysql_error(), 'content/adminusers.php', __LINE__, "Query");
?>
<h2>Manage Users</h2>
<form name="user_management">
<table width="100%">
<tr>
<td>User Name</td>
<td>Name</td>
<td>Last Logon</td>
<td>User Level </td>
<td>Remove</td>
</tr>
<?php
while($working_object = mysql_fetch_object($results)) {
$user_type = $working_object -> user_type;
if($user_type == 0) {
	$user_type_text = "User";
} else {
	$user_type_text = "Admin";
}
unset($user_type);
echo "<tr>
<td><a href=\"?view=view_user&amp;user=" . $working_object -> id . "\">" .  $working_object -> username .  "</a></td>
<td>" .  $working_object -> fname .  " " . $working_object -> lname . "</td>
<td>" . $working_object -> last_logon . "</td>
<td>" . $user_type_text . "</td>
<td>";
if($working_object -> id != $userid) { echo "<input type=\"checkbox\" name=\"delete[]\" value=\"" .  $working_object -> id .  "\">"; } else { echo "<b>Can not<br />delete self.</b>"; }
echo "</td>
</tr>";
}
?>
<tr>
<td colspan="5">
<input type="submit" value="Save Changes" onclick="javascript:savechanges();" /> | <a href="?view=admin_add_user">Add a User</a><br />
</table>
</form>
<br /><br /><a href="?view=admin">Admin Panel Home</a>
<script language="javascript" type="text/javascript">
	function savechanges() {
		var x = confirm("Really save changes?\nRemember, this is final, and can not be undone.");
		if(x) {
			//alert("Now Submitting...\nOr so we think.");
			//alert(document.user_management.action);
			document.user_management.action = "?view=remove_users";
			document.user_management.method = "post";
			document.user_management.submit;
		}
	}
</script>
<?php 
} else {
	include_once('include/noadmin.php');
} 
?>