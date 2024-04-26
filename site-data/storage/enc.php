<?php
	if($_POST['to_enc']) {
		$i = $_POST['to_enc'];
		/*$md[1] = md1($i);
		$md[2] = md2($i);
		$md[3] = md3($i);
		$md[4] = md4($i); */
		$md[5] = md5($i);
		$sha[1] = sha1($i);
		/*$sha[2] = sha2($i);
		$sha[3] = sha3($i);
		$sha[4] = sha4($i);
		$sha[5] = sha5($i); */
	}
?>
<form action="" method="post">
<input type="text" name="to_enc" />
<input type="submit" value="Encrypt" />
</form>
<?php
echo $i, "in<br>";
for($intX = 0; $intX <= 5; $intX += 1) {
	echo "MD", $intX, " is " . $md[$intX], "<br>";
}
echo "<br>";
echo $i, "in<br>";
for($intX = 0; $intX <= 5; $intX += 1) {
	echo "SHA", $intX, " is ", $sha[$intX], "<br>";
}
?>