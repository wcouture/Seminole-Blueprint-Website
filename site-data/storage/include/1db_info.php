<?php
/***********************Automatically Created by the Install Program.Do not delete any of these entries.***********************/

		$config["db_host"] = "68.178.139.8";

		$config["db_user"] = "SBPSecureFTP";

		$config["db_pass"] = "S3m1n0l3!";

		$config["db_name"] = "SBPSecureFTP";

		$db["connection"]  = mysql_connect($config["db_host"], $config["db_user"], $config["db_pass"]) or $db["error"] = mysql_error();

		mysql_select_db($config["db_name"]);
?>