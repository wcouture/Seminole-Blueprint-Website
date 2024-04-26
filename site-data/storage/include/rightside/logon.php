<?php
if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<a href="?view=logon" class="nav<?php if($view != "register" && $view != "process_register") echo ' active'; ?>">Log-On</a> <span class="hide"> | </span>
<a href="?view=register" class="nav<?php if($view == "register" || $view == "process_register") echo ' active'; ?>">Register</a>