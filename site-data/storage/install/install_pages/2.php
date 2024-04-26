<?php
$host = $_POST['db_host'];
$user = $_POST['db_username'];
$pass = $_POST['db_password'];
$name = $_POST['db_name'];

$continue = (mysql_connect($host,$user,$pass));
if($continue) {
	if(mysql_select_db($name)) {
		@unlink('../include/db_info.php');
		$db_info = fopen('../include/db_info.php','w');
		fwrite($db_info,"<?php\n");
		fwrite($db_info,"/***********************");
		fwrite($db_info,"Automatically Created by the Install Program.");
		fwrite($db_info,"Do not delete any of these entries.");
		fwrite($db_info,"***********************/");
		fwrite($db_info,'
		$config["db_host"] = "' .  $host . '";
		$config["db_user"] = "' . $user . '";
		$config["db_pass"] = "' . $pass . '";
		$config["db_name"] = "' . $name . '";');
		fwrite($db_info, '
		$db["connection"]  = mysql_connect($config["db_host"], $config["db_user"], $config["db_pass"]) or $db["error"] = mysql_error();
		mysql_select_db($config["db_name"]);');
		fwrite($db_info, "
		?>");
		echo "Database connection successful. <a href=\"?step=3\">Click Here to enter values.</a>";

	} else {
		echo "Database connection failed. We were able to connect to the database, but unable to select the database name you inserted.<br />\n
		<a href=\"javascript:history.go(-1);\">Click Here to re-enter the details and try again.</a>";	
	}
} else {
	echo "Database connection failed. We were unable to connect to your database server using the information you inserted.<br />
	<a href=\"javascript:history.go(-1);\">Click Here to re-enter the details and try again.</a>";
}

?>