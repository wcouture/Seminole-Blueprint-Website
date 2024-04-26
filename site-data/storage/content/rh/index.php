<?php
if(!defined('index')) {
	header('location: ../../');
	die('');
}
if($software['rh']) {
	if($_POST) {
		if($_POST['rhpw'] == $remote_help_pw) {
			if($_POST['accountoption'] == "add") {
				$user = substr(sha1(md5(time)),0,-35);
				$pw_to_show = md5(time());
				$pw = sha1($pw_to_show);
				$query = "INSERT INTO users (
					username,
					password,
					fname,
					lname,
					user_type
				) VALUES (
					'$user',
					'$pw',
					'BKWorks Products',
					'RH',
					1
				)";
				mysql_query($query) or errormsg(mysql_error(), 'content/rh/index.php', __LINE__);
				echo "<h2>Success!</h2>
				Username: $user<br />\n
				Password: $pw_to_show<br />\n";
			} else {
				$query = "DELETE FROM users WHERE fname = \"BKWorks Products\" AND lname = \"RH\"";
				mysql_query($query) or errormsg(mysql_error(), 'content/rh/index.php', __LINE__);
				echo "<h2>Success!</h2>
				The RH user has been successfully removed.";
			}
		} else {
			echo "<h2 color=\"red\">Error!</h2>
			The password you inserted was incorrect.";
		}
	} else {
?>
<h2>BKWorks Products RH Logon </h2>
Logging into RH requires authorization. Please enter the unique RH password now.<br />
<form action="" method="post">
<input type="text" name="rhpw" size="120" /><br />
Please choose whether to add or remove the RH account:<br />
<input type="radio" name="accountoption" value="add" />Add <input type="radio" name="accountoption" value="remove" />Remove<br />
<input type="submit" value="Log On" />
</form>
<?php
	}
}
?>