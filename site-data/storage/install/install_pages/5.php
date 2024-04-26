<?php
if($_POST['username'] && !is_numeric($_POST['username'])) {
	if($_POST['password'] == $_POST['password2'] && $_POST['password'] != "") {
		include('../include/db_info.php');
		$password = $_POST['password'];
		$password = sha1($password);
		$query = "INSERT INTO users (
			username,
			password,
			user_type
		) VALUES (
			'$_POST[username]',
			'$password',
			1
		)";
		if(mysql_query($query)) {
			$pw = fopen('installpw.php','w');
			fwrite($pw,"<?php\n");
			fwrite($pw,"\$install_pw = '" . $password . "';");
			fwrite($pw,"\n?>");
			fclose($pw);
			$_SESSION['bkwuploader'] = '1';
			echo "The databse has been updated successfully. You have been automatically logged in under your new user.<br />
			Please <a href=\"../?view=admin\">Click Here</a> to continue.<br />
			<b>NOTICE: keep a record of your new password, for it will be necessary to re-install the product at a later date.</b>";
		} else {
			error('MySQL reported' . mysql_error() . '<br />Please check your username and password and try again.');
		}
	} else {
		error('The two passwords you inserted did not match, or were blank.');
	}
} else {
	error('You must insert a username.');
}

function error($error_message) {
	echo '<font color="red">An error has occured whilst trying to install.<br />';
	echo $error_message, '<br />';
	echo '<a href="javascript:history.go(-1);">Click Here to try again.</a></font>';
	return true;
}
?>