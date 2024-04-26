<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/remove_users.php !!
!! This file is part of the Administrator panel. It is used to purge selected users from the system. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
$return_script = "<script language=\"javascript\" type=\"text/javascript\">
setTimeout('backtoadmin()',3000);
function backtousers() {
	location.href = \"?view=manage_users\";
}
</script>";
if($user_type == 1) {
	if(is_array($_POST['delete'])) {
		while(list($key,$value) = each($_POST['delete'])) {
			$query = "SELECT * FROM files WHERE owner = $value";
			$remove_file_query = mysql_query($query) or errormsg(mysql_error(),'content/admin/remove_users.php',__LINE__,'Query');
			while($working_object = mysql_fetch_object($remove_file_query)) {
				$filename = $working_object -> filename;
				if(file_exists('uploads/' . $filename)) {
					unlink('uploads/' . $filename);
				}
				$id = $working_object -> id;
				$query = "DELETE FROM files WHERE id = $id";
				mysql_query($query) or errormsg(mysql_error(), 'content/admin/remove_users.php', __LINE__, 'Query');
			}
			$query = "SELECT fname, lname FROM users WHERE id = $value";
			$results = mysql_query($query) or errormsg(mysql_error(), 'content/admin/remove_users.php', __LINE__, 'Query');
			$results = mysql_fetch_object($results);
			$del_fname = $results -> fname;
			$del_lname = $results -> lname;
			unset($results);
			
			$query = "DELETE FROM users WHERE id = $value";
			mysql_query($query) or errormsg(mysql_error(), 'content/admin/remove_users.php', __LINE__, 'Query');
			echo "Deleted $del_fname $del_lname <br /><br />";
		}
?>
<b>Completed.</b><br />
<a href="?view=manage_users">Return to Users</a>
<?=$return_script; ?>

<?php
	} else {
?>
	There were no accounts set for deletion.<br />
	<a href="?view=manage_users">Return to Users</a>
	<?=$return_script; ?>
<?php
	}
} else {
	include_once('include/no_admin.php');
}
?>
