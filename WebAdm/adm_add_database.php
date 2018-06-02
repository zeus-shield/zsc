<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<?php
include("adm_header.php");
$htmlObjects = new ZSCHtmlObjects();
?>

<html>
<head>
<?php echo $htmlObjects->loadScriptFiles(); ?>
<script type="text/javascript">
    var recorderAdr = "<?php echo $htmlObjects->readObjectAddress('LogRecorder')?>";
    var zscTokenAddress = "<?php echo $htmlObjects->readObjectAddress('TestToken')?>";
    var logedModuleAdrs = <?php echo $htmlObjects->getLogedObjectAddressArrayInString()?>;

    var web3 = setupWeb3js(false);
    var zscSetup = new ZSCSetup(recorderAdr, zscTokenAddress, logedModuleAdrs);

    function addDatabase(moduleId, elementId) {
        var databaseAdr = "<?php echo $htmlObjects->readObjectAddress('DBDatabase')?>";
        zscSetup.addDatabase(document.getElementById(moduleId).value, databaseAdr, elementId);
    }
</script>
</head>
<body>
<?php 
    echo $htmlObjects->loadHeader(); 
    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';
?>

    <div class="well">
       <text>Add database</text><br><br>
       <input type="text" id="DatabaseName" value="zsc"></input> <br> 
       <button type="button" onClick="addDatabase('DatabaseName', 'AddDatabaseHashId')">Add</button><br> 
       <text id="AddDatabaseHashId"></text>
    </div>
</body>
</html>

