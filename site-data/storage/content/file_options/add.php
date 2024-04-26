<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/file_options/add.php !!
!! This is where users will select the files they want to upload. !!
Last Updated 21 Feb 2008
************************/

if(!defined('index')) {
	header('location: ../../');
}
if(is_numeric($_POST['num_of_files'])) {
	$num_of_files = $_GET['num_of_files'];
	if($num_of_files > $max_num_files) {
		$num_of_files = $max_num_files;
	}
} else {
	$num_of_files = 1;
}
?>
<script language="javascript" type="text/javascript">
loadingimage = new Image(270,54);
loadingimage.src = 'img/loading.gif';
</script>
<h2>Upload Section</h2>
<table width="100%">
<tr>
<td width="50%">
Files To Upload:<br />
<form name="num_files" action="" method="post">
<select name="num_of_files" onChange="setnumfiles(this.value);">
<?php
	for($intX = 1; $intX <= $max_num_files; $intX += 1) {
		echo "<option value=\"$intX\"";
		if($num_of_files == $intX) echo ' selected';
		echo ">$intX</option>\n";
	}
?>
</select>
<noscript><input type="submit" value="Change" /></noscript></form>
<br /><br />
<form enctype="multipart/form-data" action="?view=process_upload" method="POST" name="upload_form" onSubmit="upload_started();">
<div id="file_section">
<b>Please Select Your <?=$num_of_files; ?> File(s) To Upload</b><br />
<?php
	for($intX = 1; $intX <= $num_of_files; $intX += 1) {
		echo "File $intX:<br />\n";
		echo "<input type=\"file\" name=\"upload[]\"><br />\n";
	}
?>
</div>
<input type="submit" value="Upload Now" name="submitbutton">
</form>
<br />
<font color="red" style="font:bold">Reminder: you are responsible for any content uploaded to your account. We reserve the right to search your files at any time. <br />
<img id="loading" width="1" height="1" border="0" style="visibility: hidden;" /></font></td>
<td>
<p style="font:bold">Allowed File Extensions:<br />
<?=$allowed_types; ?></p>

<p style="font:bold">Max File Size:<br />
<?=$max_size_kb; ?> Kilobytes</p>
<p style="font:bold">Note: This program will automatically block all uploads over 150 MB, and any series of uploads over 500 MB. </p></td>
</tr>
</table>
<script language="javascript" type="text/javascript">
	function setnumfiles(num) {
		var divtext = "<b>Please Select Your " + num + " File(s) To Upload</b><br />\n";
		var current_box = "";
		var file_box = '<input type="file" name="upload[]"><br />\n';
		for(x = 1; x <= num; x++) {
			divtext += file_box;
		}
		var thediv = document.getElementById('file_section');
		thediv.innerHTML = divtext;
	}
       function upload_started() {

          var theform = document.upload_form;
          var thebutton = theform.submitbutton;
          var theimage = document.getElementById('loading');

          thebutton.value = "** Uploading Now **";
          thebutton.disabled = "disabled";
          //alert(theimage.src);

          theimage.style.visibility = "visible";
          theimage.src = 'img/loading.gif';
          theimage.width = '270';
          theimage.height = '54';

     }
</script>