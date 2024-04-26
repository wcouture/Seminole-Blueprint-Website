<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/remove_files.php !!
!! This file is part of the Administrator panel. It is used to purge selected files from the system. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
if($user_type == 1) {
?>
<h3>Deleting Files...</h3>
<?php
	if(is_array($_POST['delete'])) {
		while(list($key,$value) = each($_POST['delete'])) {
			$query = "SELECT enc_filename, filename FROM files WHERE id = $value";
			$results = mysql_query($query);
			$results = mysql_fetch_object($results);
			$enc_filename = 'uploads/' . $results -> enc_filename;
			$filename = $results -> filename;
			$query = "DELETE FROM files WHERE id = $value";
			mysql_query($query) or error_msg(mysql_error(), 'content/admin/remove_files.php', __LINE__);
			@unlink($enc_filename);
			echo "Deleted file " . $filename . "<br /><br />";
		}
?>
<b>Operation Complete</b><br />
<a href="?view=manage_files">Back to Files</a>
<?php
	} else {
?>
There were no files set for deletion.<br />
<a href="?view=manage_files">Back to Files</a>
<?php
	}
} else {
	include_once('include/no_admin.php');
} ?>