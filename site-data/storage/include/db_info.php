<?php
/***********************Automatically Created by the Install Program.Do not delete any of these entries.***********************/

		$config["db_host"] = "localhost";

		$config["db_user"] = "semb0328_chris2";

		$config["db_pass"] = "Galaxy77!";

		$config["db_name"] = "semb0328_sbpsecureftp";

		$db["connection"]  = mysql_connect($config["db_host"], $config["db_user"], $config["db_pass"]) or $db["error"] = mysql_error();

		mysql_select_db($config["db_name"]);
?>