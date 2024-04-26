<?php
if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<ul>
	<li><a href="?view=userhome"<?php if($view == "userhome") echo ' class="current"'; ?>>Home</a></li>
	<li><a href="?view=view_files"<?php if($view == "view_files") echo ' class="current"'; ?>>My Files</a></li>
	<li><a href="?view=upload"<?php if($view == "upload" || $view == "process_upload") echo ' class="current"'; ?>>Upload</a></li>
	<li><a href="?view=profile"<?php if($view == "profile") echo ' class="current"'; ?>>View / Change Profile</a></li>
	<li><a>&nbsp;</a></li>
	<li><a href="?view=logoff"<?php if($view == "logoff") echo ' class="current"'; ?>>Log Off</a></li>
</ul>