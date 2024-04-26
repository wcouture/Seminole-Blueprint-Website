<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/userhome/index.php !!
!! This file can be considered the "Table of Contents" shown to a user after a successful logon. !!
Last Updated 28 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<h2>Welcome, <?=$fname, " ", $lname;?></h2>

You currently have <?=$num_of_files; ?> file(s) uploaded.<br />
You logged in on <?=$last_logon; ?>.<br /><br />

<h3>Main Menu</h3>

<p><a href="?view=view_files">My Files</a><br />
  <br />

<a href="?view=upload">Upload</a><br /><br />
  
  <a href="?view=profile">View / Change Profile</a><br /><br />
  
  <?php if($user_type == 1) echo "\n<a href=\"?view=admin\">ADMIN PANEL</a><br /><br />"; ?>
<a href="?view=logoff">Log Off</a></p>
