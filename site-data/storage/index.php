<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! index.php !!
!! This file serves as the template for the remainder of the software. !!
Last Updated 14 Feb 2008
************************/

define('index', true);
session_start();
include('storage/include/include.php');
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<?php include('storage/include/page_head.php'); ?>
</head>

<body>
<div id="container"><!-- begin container -->

<div id="sitename"> <!-- begin sitename -->
<h1><?php echo $maintitle; ?></h1>
<h2><?php echo $subtitle; ?></h2>
</div> <!-- end sitename -->

<div id="mainmenu"> <!-- begin mainmenu -->
<?php include_once('storage/include/toolbar.php'); ?>
</div> <!-- end mainmenu -->
 
<div id="wrap"> <!-- begin wrap -->

<div id="rightside"> <!-- begin rightside -->
<h1>Navigation</h1>

<?php include_once('storage/include/rightside.php'); ?>
</div> <!-- end rightside -->

<div id="contentalt" > <!-- begin contentalt -->
<!-- Begin Dynamic Content -->
<?php
	if(file_exists($page) && !@dir($page)) {
		include_once($page);
	} else {
		include_once('storage/content/errorpages/404.php');
	}
?>
<!-- End Dynamic Content -->
<noscript><font color="red"><br /><br /><b>WARNING: You do not have Javascript enabled or are using a browser that does not support javascript.<br />
In order for this software to operate successfully, you must enable javascript.</b></font></noscript>
</div> <!-- end content alt -->

<div class="clearingdiv">&nbsp;</div> <!-- begin and end clearingdiv -->
</div> <!-- end wrap -->
<div id="footer"><?php include_once('storage/include/footer.php'); ?></div>
</div>
</body>
</html>
