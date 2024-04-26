<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/index.php !!
!! This file is the main index of the Administrator panel. Consider it the "Table of Contents," if you will. !!
Last Updated 16 Mar 2008
************************/

if(!defined('index')) {
	header('../../');
	die('');
}
if($user_type == 1) {
?>
<h2>Admin Panel</h2>
Welcome to the admin panel, <?=$fname, " ", $lname ?>.<br />
From here, you have full accesss to the file manager.<br /><br />

<h3>Admin Panel Options</h3>
<a href="?view=manage_users">Manage Users</a><br /><br />
<a href="?view=manage_files">Manage Files</a><br /><br />
<a href="?view=settings">Mange Settings</a><br /><br />
<a href="http://forum.bkworksproducts.info/viewforum.php?f=8" target="_blank">Found a bug? Report it to the Bug Zapper</a><br /><br />
<a href="http://updateservice.bkworksproducts.info/check.php?prodid=<?=$software['prod_id']; ?>&amp;versioncode=<?=$software['versioncode']; ?>" target="_blank">Check for Updates</a><br /><br />
<a href="?view=userhome">Back to User Mode</a>
<?php
} else {
	include_once('include/noadmin.php');
}
?>