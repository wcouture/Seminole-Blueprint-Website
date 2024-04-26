<h3>Tbere Seems to be A Problem...</h3>
You need to insert the administrator password that was used when BKWorks Multi-User File Uploader was first installed.<br /><br />
Please enter it now.<br /><br />
<form action="install_pages/checkpw.php" method="post">
<input type="password" name="pw" /><br />
<input type="submit" value="Log On" />
</form>
<br />If you have forgotten the password, and have access to the files on the server, you can delete &quot;installpw.php,&quot; and then <a href="?step=0">Click Here</a> to begin again.
<?php
	if(isset($_GET['error'])) {
?>
<script language="javascript" type="text/javascript">
alert('<?=$_GET['error']; ?>');
</script>
<?php } ?>