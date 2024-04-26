<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/logoff.php !!
!! This file unsets the $_SESSION variable containing the user id. !!
Last Updated 13 Mar 2008
************************/

if(!defined('index')) {
	header('location: http://www.seminoleblueprintinc.net');
	die('');
}
unset($_SESSION['bkwuploader']);
?>
<h2><?=$logoffheader; ?></h2>
<?=$logofftext; ?><br />
<a href="http://www.seminoleblueprintinc.net">Click Here to return home.</a>
<script language="javascript" type="text/javascript">
setTimeout('returnhome()',3000);
function returnhome() {
	location.href = "http://www.semblueinc.com";
}
</script>