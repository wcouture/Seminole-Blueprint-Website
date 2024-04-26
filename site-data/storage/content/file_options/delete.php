<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/file_options/delete.php !!
!! This file is used by users to purge their selected files from the system. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<h2>Delete Files</h2>
<?php
if(is_array($_POST['delfile'])) {
	while(list($key,$value) = each($_POST['delfile'])) {
		$query = "SELECT filename, enc_filename FROM files WHERE id = '$value' AND owner = '$userid'";
		$results = mysql_query($query) or errormsg(mysql_error(), 'content/file_options/delete.php', __LINE__, 'Query');
		$num = mysql_num_rows($results);
		
		if($num != 0) {
			$results = mysql_fetch_object($results);
			$enc_filename = $results -> enc_filename;
			$filename = $results -> filename;
			@unlink('uploads/' . $enc_filename);
			$query = "DELETE FROM files WHERE id = $value AND owner = $userid";
			mysql_query($query) or errormsg(mysql_error(), 'content/file_options/delete.php', __LINE__, 'Query');
			echo "<b>Deleted $filename</b><br />";
		} else {
			echo "<b>Error Deleting ID $value</b><br />
			Either the file does not exist, or you do not have the authorization to delete it.<br />";
		}
	}
} else {
	echo "<b>There were no files set for deletion.</b><br />";
}
?>
<br /><br />
<b>Operation Complete</b><br /><br />
<a href="?view=view_files">Click Here to return to files.</a>
<script language="javascript" type="text/javascript">
setTimeout('returntofiles()',4500);
function returntofiles() {
	location.href= "?view=view_files";
}
</script>