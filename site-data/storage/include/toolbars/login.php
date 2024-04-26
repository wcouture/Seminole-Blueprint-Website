<?php
if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<ul>
	<li><a href="?view=logon"<?php if($view != "register" && $view != "process_register") echo ' class="current"'; ?>>Log-On</a></li>
	<li><a href="?view=register"<?php if($view == "register" || $view == "process_register") echo ' class="current"'; ?>>Register</a></li>
</ul>