<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/register/process_register.php !!
!! This file is called when the user submits the registration form. !!
Last Updated 11 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}

if($public_reg) {
	if($_POST) {
		if(($_POST['username']) && (!is_numeric($_POST['username']))) {
			if(($_POST['password'] == $_POST['password2']) && ($_POST['password'] != "")) {
					$username = fix_register_string('username');
					$query = "SELECT * FROM users WHERE username = \"$username\"";
					$num = mysql_num_rows(mysql_query($query));
					if($num == 0) {
						$password = fix_register_string('password');
						$password = sha1($password);
						$fname = fix_register_string('fname');	
						$lname = fix_register_string('lname');					
						$address = fix_register_string('address');
						$city = fix_register_string('city');
						$state = fix_register_string('state');
						$zipcode = fix_register_string('zip');
						$query = "INSERT INTO users (
							username,
							password,
							fname,
							lname,
							address,
							city,
							state,
							zipcode
						) VALUES (
							\"$username\",
							\"$password\",
							\"$fname\",
							\"$lname\",
							\"$address\",
							\"$city\",
							\"$state\",
							\"$zipcode\"
						)";
						mysql_query($query) or errormsg(mysql_error(), 'content/register/process_register.php', __LINE__);
						echo "<h2>$regsuccessheader</h2>
						$regsuccesstext";
					} else {
						echo '<h2>Account Registration Failed.</h2>
						The username you inserted is already in use by another user.';					
					}
			} else {
				echo '<h2>Account Registration Failed.</h2>
				The two passwords did not match, or were blank.';			
			}
		} else {
			echo '<h2>Account Registration Failed.</h2>
			You must insert a username.<br />
			Additionally, the username that you insert must not be a number.';		
		}
	} else {
		echo '<h2>Script Failed</h2>
		You must access this script using the registration form.';
	}
} else {
	echo '<h2>Account Registration Failed.</h2>
	Public registrations have been turned off by the Administrator.';
}
?>