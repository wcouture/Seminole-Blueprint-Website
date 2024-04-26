<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! viewfile.php !!
!! This file is what every single file that is uploaded is re-downloaded with. !!
Last Updated 07 Feb 2008
************************/

session_start();
if(! $_SESSION['bkwuploader']) {
	header("location: index.php");
}
define("index",true);
include('include/db_info.php');
include('include/functions.php');
$userid = $_SESSION['bkwuploader'];
include('include/pull.php');

$file_id = $_GET['file'];
if(!is_numeric($file_id)) {
	header("location: index.php");
}
$query = "SELECT filename, enc_filename, file_type, file_size, owner FROM files WHERE id = $file_id";
$results = mysql_query($query) or errormsg(mysql_error(), 'viewfile.php', __LINE__, 'Query');

$num = mysql_num_rows($results);
if($num) {
	$results = mysql_fetch_object($results);
	if($userid == $results -> owner || $user_type == 1) {
		$content_type = $results -> file_type;
		$content_length = $results -> file_size;
		$attachment_name = $results -> filename;
		$readfile = $results -> enc_filename;
		
		header("content-type: $content_type");
	
		header('Content-Disposition: attachment; filename="' . $attachment_name . '"');
		
		header('content-length: ' . $content_length);
		//header("filename=\"" . $attachment_name . "\"");
		
		readfile('uploads/' . $readfile);
	} else {
		header('HTTP/1.1 403 Forbidden');
	?>
		<h1>BKWorks Products Support</h1>
		<b>An error has occured: you do not have the proper permissions to access the file you requested.</b><br />
		<a href="javascript:closewin();">Close This Window</a>
		<script language="javascript" type="text/javascript">
			setTimeout('closewin();',3000);
			function closewin() {
				window.close;
			}
		</script>
	<?php 
	}
} else {
header("HTTP/1.1 404 Not Found");
?>
	<h1>BKWorks Products Support</h1>
	<b>An error has occured: The file you requested could not be found in the database.</b><br />
	<a href="javascript:closewin();">Click here to close this window.</a>
	<script language="javascript">
		setTimeout('closewin()',5000);
		function closewin() {
			window.close();
		}
	</script>
<?php 
}
?>