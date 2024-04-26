<?php
if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<a href="?view=userhome" class="nav<?php if($view=="userhome" || $view=="home") echo ' active'; ?>">Home</a><span class="hide"> | </span>
<a href="?view=view_files" class="nav<?php if($view == "view_files") echo ' active'; ?>">My Files</a> <span class="hide"> | </span>
<a href="?view=upload" class="nav<?php if($view == "upload" || $view == "process_upload") echo ' active'; ?>">Upload</a> <span class="hide"> | </span>
<a href="?view=profile" class="nav<?php if($view == "profile" || $view == "change_password") echo ' active'; ?>">Profile</a> <span class="hide"> | </span>
<a href="?view=logoff" class="nav<?php if($view=="logoff") echo ' active'; ?>">Log Off</a> <span class="hide"> | </span>