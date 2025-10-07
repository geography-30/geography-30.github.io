<?
$ads_txt = "https://data.adinplay.com/ads/mains.io/ads.txt";

//$ads_txt = "https://data.adinplay.com/ads/agario.one/ads.txt";

header("Content-Type: text/plain");
//echo $gtag."\n";
$fh = fopen($ads_txt,'r');
while ($line = fgets($fh)) {
	
  echo($line);
  //echo "\n";
}
fclose($fh);
?>

