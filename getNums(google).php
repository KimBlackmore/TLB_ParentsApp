<?php

$db = mysql_connect("173.194.106.50:3306", "kim", "EatMyDust1");
if (!db) { 
  die("Couldn't connect to MySQL"); 
} 

mysql_select_db("Points",$db) 
  or die("Select Database Error: ".mysql_error()); 
 
$window = 7;
$todaytext = date("Y-m-d"); 
$todaysec = strtotime($todaytext);
$startsec = $todaysec-($window-1)*86400; //one week earlier 

//for every day in the window - if there is no entry in the database, add a 0 entry
for  ($datesec = $startsec ; $datesec  <= $todaysec; $datesec = $datesec + 86400 ) {
  $datenodash=date("Ymd",$datesec);//
  $pad_zero = mysql_query("INSERT INTO `Points`.`NumWalks2` (`Num`, `Label`) VALUES ('0', $datenodash) ON DUPLICATE KEY UPDATE Num=Num" ); 
}

//now get all the entries in the window and put then in an array
$result = mysql_query("SELECT * FROM `NumWalks2` WHERE `Label` > CURDATE() - $window " ,$db); 
$alldata = array();

 while ($row = mysql_fetch_assoc($result)) {
      array_push($alldata,$row);
     // echo(json_encode($row)."<br />");
}

/*
// Obtain a list of columns
foreach ($alldata as $key => $row) {
    $num[$key]  = $row['Num'];
    $label[$key] = $row['Label'];
}
// Sort the data with volume descending, edition ascending
// Add $data as the last parameter, to sort by the common key
array_multisort($label, SORT_ASC, $num, SORT_ASC, $alldata);
*/

$data = json_encode($alldata);
echo $data; 

/*
ToDo: convert from mysql to PDO
}*/

?>





