<?php
	define('index',true,false);
	session_start();
	
	include('../include/version.inc.php');
	if(file_exists('installpw.php')) include('installpw.php');
	if((isset($install_pw)) && (!isset($_SESSION['bkwuploadinstall']))) {
		$step = "logon";
	} else {
		$step = $_GET['step'];
		if($step == "") {
			$step = 0;
		}
	}
	include('../include/version.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<title>Installing BKWorks Multi-User File Manager</title>
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" href="andreas08.css" type="text/css" media="screen,projection" />
</head>

<body>
<div id="container" >

<div id="header">
<h1>BKWorks Multi-User File Manager</h1>
<h2>Version <?=$software['version']; ?> Installation</h2>
</div>

<div id="navigation">
<ul>
<li<? if($step == 0) echo ' class="selected"'; ?> ><a>Intro</a></li>
<li<? if($step == 1) echo ' class="selected"'; ?> ><a>Database Details </a></li>
<li<? if($step == 2) echo ' class="selected"'; ?> ><a>Database Connection</a></li>
<li<? if($step == 3) echo ' class="selected"'; ?> ><a>Entering Values</a></li>
<li<? if($step == 4) echo ' class="selected"'; ?> ><a>Admin User</a></li>
<li<? if($step == 5) echo ' class="selected"'; ?> ><a>Log On</a></li>
</ul>
</div>

<div id="content">
<?php
	include_once('install_pages/' . $step . '.php');
?></div>
<div id="subcontent"></div>

<div id="footer">
<p>&copy; 2008 <a href="http://www.bkworksproducts.info">BKWorks Products</a> | Template Design by <a href="http://andreasviklund.com">Andreas Viklund</a></p>
</div>

</div>
</body>
</html>