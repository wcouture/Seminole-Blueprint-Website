<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/homepage/index.php !!
!! This page is the logon page (where the user enters their username and password). !!
Last Updated 11 Feb 2008

Version 1.0 build start: 5 Jan 2008
Based on code from version 0.8
Dated October, 2006
************************/


if(!defined('index')) {
	header("location: ../../");
	die('');
}

?>
<h1><?=$logonheader; ?></h1>
<p><?=$logontext; ?></p>
<?php
	if($_GET['error']) { echo "<font color=\"red\">$_GET[error]</font><br />"; } ?>
<form action="logon.php" method="post">
	<label for="username">Username or User ID:<br />
	<input type="text" name="username" /><br />
	<label for="password">Password:<br />
	<input type="password" name="password" /><br />
	<input type="submit" value="Log On" />
</form><br />
<a href="?view=register">Don't have an account? Click here to register.</a>