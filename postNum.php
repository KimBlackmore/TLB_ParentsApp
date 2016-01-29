<?php

$db = mysql_connect("localhost", "fwdbu11233", "meexubon");
if (!db) { 
  die("Couldn't connect to MySQL"); 
} 

mysql_select_db("fwdbd11233",$db) 
  or die("Select Database Error: ".mysql_error()); 

//url with postNum.php?num=3&&date=20150305 is how to GET data without feeding in from main.js
//$n = $_REQUEST["num"];
//$d = $_REQUEST["date"];
//
//echo("hello ");

//echo($n); //if run php directly in browser this shows up, but if call from js this is fed back as the data to js
//echo($d);


//$result = mysql_query("INSERT INTO `fwdbd11233`.`NumWalks2` (`Num`, `Label`) VALUES ($n, $d)"); 
$result = mysql_query("INSERT INTO `fwdbd11233`.`NumWalks2` (`Num`, `Label`) VALUES ($n, $d) ON DUPLICATE KEY UPDATE Num= $n" ); 

//$result = mysql_query("INSERT INTO `fwdbd11233`.`NumWalks2` (`Num`, `Label`) VALUES ('.$n.', $d) ON DUPLICATE KEY UPDATE Num = $n"); 

if($result){
	echo($result);
} else {
	echo(" oh that didn't work");
}

/*
ToDo: convert from mysql to PDO
}*/

?>





