<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<html>
<head>
<?php 
include("include.php");
$htmlObjects = new ZSCInclude("unknow");
echo $htmlObjects->loadScriptFiles(); 
?>

</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div class="well" id="PageAlert"><?php echo $htmlObjects->loadAlert(); ?></div>
        <div class="well" id="PageBody"></div>
    </div>

<script type="text/javascript">

</script>

</body>
</html>
