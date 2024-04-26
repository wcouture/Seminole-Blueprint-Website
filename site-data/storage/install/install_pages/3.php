<?php
define('index',true);
include('../include/db_info.php');

$query = "CREATE TABLE IF NOT EXISTS files (
	id bigint(9) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	owner bigint(9) NOT NULL,
	filename varchar(255) NOT NULL,
	enc_filename varchar(255) NOT NULL,
	file_type varchar(50) NOT NULL,
	file_size bigint(15) NOT NULL,
	date_uploaded varchar(50) NOT NULL
)";
mysql_query($query);

$query = "CREATE TABLE IF NOT EXISTS settings (
	title varchar(255) NOT NULL,
	subtitle varchar(255) NOT NULL,
	logon_header varchar(255) NOT NULL,
	logon_text text NOT NULL,
	register_header varchar(255) NOT NULL,
	register_text text NOT NULL,
	register_success_header varchar(255) NOT NULL,
	register_success_text text NOT NULL,
	logoff_header varchar(255) NOT NULL,
	logoff_text text NOT NULL,
	public_reg tinyint(1) NOT NULL,
	public_edit_profile tinyint(1) NOT NULL,
	allowed_types text NOT NULL,
	max_size bigint(7) NOT NULL,
	max_num_files int(2) NOT NULL,
	const tinyint(1) NOT NULL
)";
mysql_query($query) or die("Can't query on line 35 because " . mysql_error());;

$remote_help_pw = md5(time());
$query = "INSERT INTO settings (
	title,
	subtitle,
	logon_header,
	logon_text,
	register_header,
	register_text,
	register_success_header,
	register_success_text,
	logoff_header,
	logoff_text,
	public_reg,
	public_edit_profile,
	allowed_types,
	max_size,
	max_num_files,
	const
) VALUES (
	'BKWorks Products',
	'Multi-User File Uploader',
	'Log On',
	'Please insert your username and password to continue.',
	'Registration',
	'Please fill out the form below to register.',
	'Registration Successful',
	'You have successfully registered.<br />\nPlease remember your password as it has been encrypted in our database.',
	'Log Off',
	'You have successfully logged off',
	'0',
	'1',
	'doc docx ppt pptx exl exlx rtf txt',
	'1048576',
	'5',
	'1'
)";
mysql_query($query) or die("Can't query on line 74 because " . mysql_error());


$query = "CREATE TABLE IF NOT EXISTS users (
	id int(4) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	fname varchar(255) NOT NULL,
	lname varchar(255) NOT NULL,
	address varchar(255) NOT NULL,
	city varchar(255) NOT NULL,
	state varchar(30) NOT NULL,
	zipcode varchar(15) NOT NULL,
	last_logon varchar(200) NOT NULL,
	user_type tinyint(1) NOT NULL
)";
mysql_query($query) or die("Can't query on line " .  __LINE__ . " because " . mysql_error());

include_once('install_pages/remotehelp.php');
?>
All information has been successfully added.<br />
<a href="?step=4">Please click here to continue.</a> 