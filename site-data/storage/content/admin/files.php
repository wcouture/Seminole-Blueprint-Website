<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/files.php !!
!! This file is part of the Administrator panel. It is used to show all the currently uploaded files held in the system. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
if($user_type == 1) {
	$files_query = "SELECT * FROM files WHERE owner != $userid";
	$results = mysql_query($files_query) or errormsg(mysql_error(), 'content/admin/files.php', __LINE__, 'Query');
?>
<h2>Currently Uploaded Files (Not Including Your Own)</h2>
<form name="manage_files">
<table width="100%">
<tr>
<td>Owner</td>
<td>Filename</td>
<td>Date Uploaded</td>
<td>Delete</td>
</tr>
<?php
while($working_object = mysql_fetch_object($results)) {
	$owner = $working_object -> owner;
	$owner_id = $owner;
	$owner_query = "SELECT username FROM users WHERE id = $owner";
	$owner = mysql_query($owner_query) or errormsg(mysql_error(), 'content/admin/files.php', __LINE__, 'Query');
	$owner = mysql_fetch_object($owner);
	$owner = $owner -> username;
	echo "<tr>
	<td><a href=\"?view=view_user&amp;user=$owner_id\">", $owner, "</a></td>
	<td>", $working_object -> filename, "</td>
	<td>", $working_object -> date_uploaded, "</td>
	<td><input type=\"checkbox\" name=\"delete[]\" value=\"", $working_object -> id, "\" onclick=\"enablebutton();\"></td>
	</tr>";
}
?>
</table>
<input type="submit" value="No Changes to Save" onClick="savechanges();" disabled="disabled" name="submitbutton">
</form><br /><br />
<a href="?view=admin">Admin Panel Home</a>
<script language="javascript" type="text/javascript">
function savechanges() {
	var x = confirm("Really save changes?\nRemember, this action can not be undone.");
	if(x) {
		document.manage_files.action = "?view=remove_files";
		document.manage_files.method = "post";
		document.manage_files.submit;
	}
}
function enablebutton() {
	var thebutton = document.manage_files.submitbutton;
	thebutton.disabled = "";
	thebutton.value = "Save Changes";
}
</script>
<?php

} else {
	include_once('include/no_admin.php');
}
?>