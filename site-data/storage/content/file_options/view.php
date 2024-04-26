<?php
/************************
BKWorks Multi-User File Uploader
Version 1.00
!! content/file_options/view.php !!
!! This file allows the user to view all their currently uploaded files. !!
Last Updated 15 Mar 2008
************************/

if(!defined('index')) {
	header('location: ../../');
	die('');
}
?>
<h2>View Uploaded Files</h2>
<form action="?view=delete" method="post">
  <table width="100%" border="0">
    <tr>
      <td align="center">Filename</td>
      <td align="center">Uploaded On</td>
      <td align="center">Delete</td>
    </tr>
    <?php
		if($num_of_files == 0) {
			echo "<tr><td colspan=\"3\"><b>You currently have no files uploaded.</b></td></tr>";			
		} else {
			while($working_array = mysql_fetch_array($files_query)) {
				echo "<tr>
					<td align=\"center\"><a href=\"?view=viewfile&amp;file=", $working_array['id'], "\" target=\"_blank\">", $working_array['filename'], "</a></td>
					<td align=\"center\"><b>", $working_array['date_uploaded'], "</b></td>
					<td align=\"center\"><input type=\"checkbox\" name=\"delfile[]\" value=\"", $working_array['id'], "\"></td>
				</tr>";
			}
		}
	?>
    <tr>
      <td colspan="3" align="center"><a href="?view=upload">Begin Upload Process </a><br />
          <? if($num_of_files > 0) echo "<input type=\"submit\" value=\"Delete Checked Files\">"; ?></td>
    </tr>
  </table>
</form>
<script language="javascript" type="text/javascript">
function del(id,name) {
	var x = confirm("Really delete this file?");
	if(x) {
		location.href = "?view=delete&file=" + id;
	}
}
</script>