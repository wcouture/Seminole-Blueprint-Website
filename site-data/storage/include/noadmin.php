<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/noadmin.php !!
!! If an Admin Panel page notices that the user is not an Administrator, it shows this page. !!
Last Updated 13 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../');
	die('');
}
?>
<h2>Access is Denied</h2>
You do not have the authorization to access the Admin Panel.<br />
<a href="?view=userhome">Return Home</a>
<script language="javascript" type="text/javascript">
setTimeout('returnhome()',3000);
function returnhome() {
	location.href="?view=home";
}
</script>