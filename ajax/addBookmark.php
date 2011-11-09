<?php
if(isset($_GET['title']) && isset($_GET['netSessionID']) && isset($_GET['timePoint']) && isset($_GET['userID']) && isset($_GET['siteID']) && isset($_GET['presentationID'])){

echo 'SUCCESS! ';
print_r($_GET);

}else{

echo 'failure.... ';
print_r($_GET);

}



?>