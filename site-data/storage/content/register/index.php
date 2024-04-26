<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/register/index.php !!
!! This file is the registration form. !!
Last Updated 11 Feb 2008
************************/

if(!defined('index')) {
	header("location: ../../");
	die('');
}
?>
<h3><?=$registerheader; ?></h3>
<?=$registertext; ?><br />

<?php
if($public_reg == 1) {
?>
<form action="?view=process_register" method="post">
	<label for="username">Username:</label><br />
	<input type="text" name="username" /><br />
	
	<label for="password">Password:</label><br />
	<input type="password" name="password" /><br />
	
	<label for="password2">Confirm Password:</label><br />
	<input type="password" name="password2" /><br />
	
	<label for="fname">First Name:</label><br />
	<input type="text" name="fname" /><br />
	
	<label for="lname">Last Name:</label><br />
	<input type="text" name="lname" /><br />
	
	<label for="address">Address:</label><br />
	<input type="text" name="address" /><br />
	
	<label for="city">City:</label><br />
	<input type="text" name="city" /><br />
	
	<label for="state">State:</label><br />
	<input type="text" name="state" /><br />
	
	<label for="zip">Zip / Postal Code</label><br />
	<input type="text" name="zip" /><br />
	
	<img src="captcha/CaptchaSecurityImages.php" /><br /><br /><br /><br /><br />
	<label for="captcha">Enter the Above Characters:</label><br />
	<input type="text" name="captcha" /><br />

	<input type="submit" value="Register" />	
</form>
<?php
} else {
?>
<h3>Sorry, the Administrator has turned of public registrations.</h3>
For more information, please contact whomever runs this website.
<?php
}
?>