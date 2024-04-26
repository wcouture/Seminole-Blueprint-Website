<?php
	if(file_exists('../installpw.php')) include_once('../installpw.php');
	$pass = $_POST['pw'];
	$pass = sha1($pass);
	if($pass == $install_pw) {
		session_start();
		
		$_SESSION['bkwuploadinstall'] = 1;
		header('location: ../index.php?step=1');
	} else {
		header('location: ../index.php?step=logon&error=Invalid Password');
	}
?>