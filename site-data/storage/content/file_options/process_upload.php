<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/file_options/process_upload.php !!
!! This file is what uploads the files the user has selected into the system. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<h2>File Upload Status</h2>
<?php
$pass = 1;
if(is_array($_FILES['upload'])) {
	while(list($key,$value) = each($_FILES['upload']['name'])) {
		if($value) {
			$value = fix_string($value);
			//set_time_limit('300');
			echo "<b>Beginning File $value</b><br />\n";
			$ext = strtolower(substr($value, strrpos($value, '.') + 1));
			echo "File Extension: $ext<br />
			Checking if Extension is Allowed: ";
			$ok = in_array($ext,$allowed_types_array);
			if($ok) {
				echo "Succeed.<br />\n";
				
				$size = $_FILES['upload']['size'][$key];
				echo "File Size: $size Bytes<br />\n";
				echo "Max File Size: $max_size Bytes<br />\n";
				if($size > $max_size) {
					echo "<font color=\"red\">Failed - Too Large. File Not Uploaded.</font><br /><br />";
					@unlink($_FILES['upload']['tmp_name'][$key]);
					$pass = false;
				} else if($size == 0) {
					echo "File Upload Failed.<br />
					This program has stopped your upload because it is too large.<br />\n"; 
					$pass = 0;
					@unlink($_FILES['upload']['tmp_name'][$key]);
				} else {
					$md5_title = md5($userid . $value . time());
					$query = "INSERT INTO files (
						owner,
						filename,
						enc_filename,
						file_type,
						file_size,
						date_uploaded
					) VALUES (
						\"$userid\",
						\"" . $value . "\",
						\"" . $md5_title . "\",
						\"" . $_FILES['upload']['type'][$key] . "\",
						\"" . $_FILES['upload']['size'][$key] . "\",
						\"" . date('F d, Y') . "\"
					)";
					mysql_query($query) or errormsg(mysql_error(), 'content/file_options/process_upload.php', __LINE__, 'Query');
					move_uploaded_file($_FILES['upload']['tmp_name'][$key], 'uploads/' . $md5_title);
					echo "<b>File Uploaded Successfully.</b><br /><br />";
				}
			} else {
				$pass = false;
				echo "<font color=\"red\">Failed. File Not Uploaded.</font><br /><br />";
				@unlink($_FILES['upload']['tmp_name'][$key]);
				$pass = 0;
			}
		}
	}
} else {
	$pass = false;
	echo '<font color="red">There were no files selected to upload.</font>';
}
?>
<br /><br />
<b>End of All File Operations</b><br />
<a href="?view=view_files">Click Here to view uploaded files</a>
<script language="javascript" type="text/javascript">
var pass = <?=$pass; ?>;
if(pass) {
	setTimeout('gotofiles()',3000);
}
function gotofiles() {
	location.href = "?view=view_files";
}
</script>