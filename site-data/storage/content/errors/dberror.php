<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/errors/dberror.php !!
!! This page simply informs users that the system can't connect to the database. !!
Last Updated 16 Mar 2008

## NOTE: This page may be moved into the 'errorpages' folder. ##

************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<h2>An Error has Occured</h2>
We are sorry to inform you that we have not been able to connect to the database.<br />
MySQL reported <?=$db['error']; ?><br /><br />

Make sure that you have run the <a href="install/index.php?step=0">product installer.</a>