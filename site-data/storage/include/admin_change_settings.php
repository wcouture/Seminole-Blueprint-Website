<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/admin_change_settings.php !!
!! This file is called when an Adminsitrator changes the settings. !!
Last Updated 07 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../');
}
$maintitle = $_POST['title'];
$subtitle = $_POST['subtitle'];
$logonheader = $_POST['logon_header'];
$logontext= $_POST['logon_text'];
$registerheader = $_POST['register_header'];
$registertext = $_POST['register_text'];
$regsuccessheader = $_POST['register_success_header'];
$regsuccesstext = $_POST['register_success_text'];
$logoffheader = $_POST['logoff_header'];
$logofftext = $_POST['logoff_text'];
$allowed_types = $_POST['allowed_filetypes'];
$max_size = $_POST['max_size'];
$max_num_files = $_POST['max_num_files'];
$public_reg = $_POST['public_registration'];
$public_edit_profile = $_POST['public_edit_profile'];
$query = "UPDATE settings SET
	title = \"$maintitle\",
	subtitle = \"$subtitle\",
	logon_header = \"$logonheader\",
	logon_text = \"$logontext\",
	register_header = \"$registerheader\",
	register_text = \"$registertext\",
	register_success_header = \"$regsuccessheader\",
	register_success_text = \"$regsuccesstext\",
	logoff_header = \"$logoffheader\",
	logoff_text = \"$logofftext\",
	public_reg = \"$public_reg\",
	public_edit_profile = \"$public_edit_profile\",
	allowed_types = \"$allowed_types\",
	max_size = \"$max_size\",
	max_num_files = \"$max_num_files\"
WHERE const = '1'";
mysql_query($query) or errormsg(mysql_error(), 'include/admin_change_settings.php',__LINE__);
?>
<b>Settings Changed Successfully</b><br /><br />