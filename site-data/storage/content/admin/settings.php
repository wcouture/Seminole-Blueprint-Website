<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/settings.php !!
!! This file is part of the Administrator panel. It allows an Administrative user access to change the settings of the Upload Manager. !!
Last Updated 14 Feb 2008
************************/

if(!defined('index')) {
	header('../../');
	die('');
}
if($user_type == 1) {

?>
<a href="?view=admin">Admin Panel Home </a>
<h2><?=$maintitle; ?> Settings</h2>
<form action="" method="post" name="SettingsForm">
<?php
if($_POST) include_once('include/admin_change_settings.php');
?>
<label for="title">Program Title (appears in title bar and on top of page):<br />
<input type="text" name="title" value="<?=$maintitle; ?>"><br /><br />

<label for="subtitle">Subtitle (appears beneath the program title):<br />
<input type="text" name="subtitle" value="<?=$subtitle; ?>"><br /><br />

<label for="logon_header">Logon Page Header:</label><br />
<input type="text" name="logon_header" value="<?=$logonheader; ?>"><br /><br />

<label for="logon_text">Logon Page Text:</label><br />
<textarea name="logon_text" rows="6" cols="45"><?=$logontext; ?></textarea><br /><br />

<label for="register_header">Registration Page Header:</label><br />
<input type="text" name="register_header" value="<?=$registerheader; ?>"><br /><br />

<label for="register_text">Registration Page Text:</label><br />
<textarea name="register_text" rows="6" cols="45"><?=$registertext; ?></textarea><br /><br />

<label for="register_success_header">Successful Registration Header:</label><br />
<input type="text" name="register_success_header" value="<?=$regsuccessheader; ?>"><br /><br />

<label for="register_success_text">Successful Registration Text:</label><br />
<textarea name="register_success_text" rows="6" cols="45"><?=$regsuccesstext; ?></textarea><br /><br />

<label for="logoff_header">Log-Off Page Header:</label><br />
<input type="text" name="logoff_header" value="<?=$logoffheader; ?>"><br /><br />

<label for="logoff_text">Log-Off Page Text:</label><br />
<textarea name="logoff_text" rows="6" cols="45"><?=$logofftext; ?></textarea><br /><br />

<label for="allowed_filetypes">Allowed File Extensions (seperate with a space): <a href="javascript:fileext();">Help</a></label><br />
<textarea name="allowed_filetypes" rows="6" cols="45"><?=$allowed_types; ?></textarea><br />
<br /><br />

<label for="max_size">Maximum File Size: <a href="javascript:help_filesize();">Help</a></label><br />
<input type="text" name="max_size" value="<?=$max_size; ?>"> bytes<br />
<select name="filesize_from">
	<option value="kb">Kilobytes</option>
	<option value="mb">Megabytes</option>
</select>
<a onClick="filesize();">Set For Me</a><br ><br />

<label for="max_num_files">How many files may your users upload at one time?</label><br />
<select name="max_num_files">
<?php
	//echo '<option value="', $max_num_files, '">', $max_num_files, '</option>';
	for($intX = 1; $intX <= 20; $intX += 1) {
	echo '<option value="', $intX, '"';
	if($intX == $max_num_files) echo ' selected="selected"';
	echo '>', $intX, "</option>\n";
	}
?>
</select>
<br /><br />

<label for="public_registration">May the General Public register for an account?</label>
<br />
<select name="public_registration">
	<option value="0"<?php if($public_reg == 0) echo ' selected'; ?>>No</option>
	<option value="1"<?php if($public_reg == 1) echo ' selected'; ?>>Yes</option>
</select><br /><br />

<label for="public_edit_profile">May your Users edit their profiles?</label>
<br />
<select name="public_edit_profile">
	<option value="0"<?php if($public_edit_profile == 0) echo ' selected'; ?>>No</option>
	<option value="1"<?php if($public_edit_profile == 1) echo ' selected'; ?>>Yes</option>
</select><br /><br />
<input type="submit" value="Save Changes"> | <a onClick="javascript:resettodefault();">Restore to Default</a>
</form>
<script language="javascript" type="text/javascript" src="include/defaultsettings.js"></script>
<script language="javascript" type="text/javascript">
function fileext() {
	window.open("docs/file_extensions.php","helpwindow");
}
function filesize() {
	var size = document.SettingsForm.max_size.value;
	var method = document.SettingsForm.filesize_from.value;
	//alert(method);
	//alert(document.SettingsForm.filesize_from.value);
	var finalsize = 0;
	finalsize = size * 1024;
	if(method == "mb") {
		finalsize *= 1024;
	}
	document.SettingsForm.max_size.value = finalsize;
}
function help_filesize() {
	window.open("docs/file_size.php","helpwindow");
}
</script>
<a href="?view=admin">Admin Panel Home</a>
<?php
} else {
	include_once('include/no_admin.php');
}
?>
