<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/admin/delete_files.php !!
!! This file is part of the Administrator panel. It is used to remove selected files from the system. !!
Last Updated 11 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}

if($user_type == 1) {
	if($_POST) {
		$post = $_POST['delete'];
		if(is_array($post)) {
			while(list($key,$value) = each($post)) {
				$query = "SELECT enc_filename FROM files WHERE id = $value";
				$results = mysql_query($query) or errormsg(mysql_error(), 'content/admin/delete_files.php', __LINE__);
				$num = mysql_num_rows($results);
				if($num == 1) {
					$results = mysql_fetch_object($results);
					$filename = $results -> filename;
					$enc_filename = $results -> enc_filename;
					@unlink('uploads/' . $enc_filename);
					$query = "DELETE FROM files WHERE id = $value";
					mysql_query($query) or errormsg(mysql_error(), 'content/admin/delete_files.php',__LINE__);
					unset($_POST);
				}	
			}
		}		
	}
}
include('content/admin/view_user.php');
?>