<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Untitled Document</title>
</head>

<body>
<h3>BKWorks Mult-User File Uploader</h3>
<p>When it came down to programming this application, I honestly did not know who I was programming it for. I just knew that I would sit down and write a file uploader. In doing so, I taught myself many new security features of the PHP programming language. Below is a list of a few things that make this product the most secure (and free, might I add ^_^) uploader in existence.</p>
<p>
<strong>SHA1 Encryption </strong>You know that your passwords are secure when the strongest 1-way encrpytion a language offers is used.<br />
<strong>SQL Injection Prevention</strong> There is little to worry about when it comes to an SQL injection attack. There are countless measures used in the PHP intake forms to prevent any unwanted data from leaving the database.<br />
<strong>PHP Session Controls</strong> Using the most secure method of user tracking, there is little to worry about regarding users gaining access where they do not belong.<br />
<strong>Index Check</strong> All files check to make sure they are being called for by the index. If they are not, they immediatly tell the browser to load the index. If it doesn't the file shuts itself down and quits<br />
<strong>File Securtiy</strong> All the files that are uploaded through the File Manager are automatically renamed... to a 160 bit encrypted filename. Nobody knows what the filename actually is once it's been uploaded. That's not a problem, though. The original filename is stored in the database, and the user will never know the difference. Using the PHP Readfile function, the program autoamtically looks in the database for the encrypted filename, opens it, and then proceeds to send the file to the user. If the owner does not match who is logged in, then the user receives an unauthorized error.<br />
<strong>All variables are loaded at the same time</strong>, therefore protecting them from PHP's 'global variables' feature. 

</html>
