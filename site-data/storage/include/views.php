<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! include/views.php !!
!! This file contains the large switch statement used to determine what page to display. Look while the system is running and you will see 'index.php?view='[value].'  !!
Last Updated 16 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../');
}
switch($view) {
	default:
	case "":
	case "home":
		if(!$userid) {
			$page = 'homepage/index.php';
			$title = "Homepage";
		} else {
			$page = 'userhome/index.php';
			$title = $fname . " " . $lname . "'s Homepage";
		}
	break;
	case "userhome":
		$page = 'userhome/index.php';
		$title = $fname . " " . $lname . "'s Homepage";
	break;
	case "logoff":
		$page = 'logoff.php';
		$title = $logoffheader;
	break;
	case "dberror":
		$page = 'errors/dberror.php';
		$title = "Database Error";
	break;
	
	/*********************
 		REGISTRATION
	*********************/
	case "register":
		$page = 'register/index.php';
		$title = $registerheader;
	break;
	case "process_register":
		$page = 'register/process_register.php';
		$title = $registerheader;
	break;
	
	/********************
   		USER OPTIONS
	********************/
	case "file_options":
		$page = 'file_options/index.php';
		$title = $fname . " " . $lname . "'s File Options";
	break;
	case "upload":
		$page = 'file_options/add.php';
		$title = "Upload Files";
	break;
	case "process_upload";
		$page = 'file_options/process_upload.php';
		$title = "Upload File(s)";
	break;
	case "view_files":
		$page = 'file_options/view.php';
		$title = "View Files";
	break;
	case "viewfile":
		$file = $_GET['file'];
		header("location: viewfile.php?file=" . $file);
	break;
	case "delete":
		$page = 'file_options/delete.php';
		$title = "View Files";
	break;
	case "profile":
		$page = 'profile/index.php';
		$title = "Profile";
	break;
	case "change_password":
		$page = 'profile/change_password.php';
		$title = "Change Password";
	break;
	
	/***********************
          ADMIN PANEL
	***********************/
	case "admin":
		$page = 'admin/index.php';
		$title = "Admin Panel";
	break;
	case "manage_users":
		$page = 'admin/users.php';
		$title = "Admin Panel - Manage Users";
	break;
	case "remove_users":
		$page = 'admin/remove_users.php';
		$title = "Admin Panel - Remove Users - Status";
	break;
	case "manage_files":
		$page = 'admin/files.php';
		$title = "Admin Panel - Manage Files";
	break;
	case "remove_files":
		$page = 'admin/remove_files.php';
		$title = "Admin Panel - Remove Files - Status";
	break;
	case "view_user":
		$page = 'admin/view_user.php';
		$title = 'Admin Panel - View User';
	break;
	case "settings":
		$page = 'admin/settings.php';
		$title = "Admin Panel - Settings";
	break;
	case "admin_change_password":
		$page = 'admin/change_password.php';
		$title = 'Admin Panel - Change Password';
	break;
	case "admin_add_user":
		$page = 'admin/create_user.php';
		$title = 'Admin Panel - Create a User';
	break;
	case "create_new_user":
		$page = 'admin/add_user.php';
		$title = 'Admin Panel - Add a User Status';
	break;
	case "admin_delete_files":
		$page = 'admin/delete_files.php';
		$title = "Admin Panel - View User";
	break;
	
	/***********************************
				Remote Help
	***********************************/
	case "rh":
		$page = 'rh/index.php';
		$title = "RH Login";
	break;
}
$page = 'content/' . $page;
?>