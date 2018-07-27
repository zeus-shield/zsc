<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
$tokenId = $_GET["tokenId"];
$picPrefix = "robot";
$picSuffix = ".jpg";
if ($tokenId < 3) {
	$picPrefix = "art".$tokenId;
}


echo '{'.
  '"name": "Robot token #'.$tokenId.'",'.
  '"image_url": "http://yongyao.se/WebClient/pics/'.$picPrefix.$picSuffix.'",'.
  '"home_url": "http://yongyao.se/WebClient/",'.
  '"description": "This is the amazing Robot #'.$tokenId.', please buy me!"'.
  '}';
?>

