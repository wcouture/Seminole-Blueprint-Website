<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! logon.php !!
!! This page is what the logon page calls to verify the inserted username and password. !!
Last Updated 11 Feb 2008
************************/

if(!$_POST) {
	header("location: index.php?view=logon&error=No Logon Data Was Passed To The Logon Script.");
	die('');
} else if(!$_POST['username'] || !$_POST['password']) {
	header("location: index.php?view=logon&error=You Must Insert A Username And Password Combination.");
	die('');
} else {
	$username = $_POST['username'];
	$username = stripslashes($username);
	$username = htmlspecialchars($username);
	
	$password = $_POST['password'];
	$password = sha1($password); // Strongest 1-way encryption available
	
	define('index',true);
	include('include/db_info.php');
	include('include/functions.php');
	$query = "SELECT * FROM users WHERE password = \"$password\" AND username = \"$username\" OR id = \"$username\"";
	$query = mysql_query($query) or errormsg(mysql_error, "logon.php", __LINE__, "Query");
	//$results = mysql_fetch_object($query);
	//$pw = $results -> password;
	$num = mysql_num_rows($query);
	if($num == 0) {
		mysql_close($db['connection']);
		header("location: index.php?view=logon&error=Invalid Username / Password");
		die('');
	} else {
		$id = mysql_fetch_object($query);
		$id = $id -> id;
		session_start();
		$_SESSION['bkwuploader'] = $id;
		date_default_timezone_set('America/New_York');
		$login_date = date("D, F d, Y h:i:s A T");
		$query = "UPDATE users SET last_logon = '$login_date' WHERE id = $id";
		mysql_query($query) or errormsg(mysql_error(), 'logon.php', __LINE__, 'Query');
		//echo $id;
		header("location: index.php?view=userhome");
		die('');
	} /*
	echo "Inputted Username: $username<br>
	Passsword (sha1): $password<br>
	DB PW: $pw"; */
}
?>