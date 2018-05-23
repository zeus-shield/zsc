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
    var recorderAdr = "<?php echo $htmlObjects->readModuleAddress('LogRecorder')?>";
    var zscTokenAddress = "<?php echo $htmlObjects->readModuleAddress('zscTokenAddress')?>";
    var factoryModuleAdrs = <?php echo $htmlObjects->getFactoryModuleAddressArrayInString()?>;

    var web3 = setupWeb3js(false);
    var zscSetup = new ZSCSetup(recorderAdr, zscTokenAddress, logedModuleAdrs);

    function addDatabase(moduleId, elementId) {
        zscSetup.addDatabaseModule(document.getElementById(moduleId).value, elementId);
    }
</script>
</head>
<body>
<?php 
    echo $htmlObjects->loadHeader(); 
    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';
    echo $htmlObjects->loadAllAdrs();
?>

    <div class="well">
       <text>Add database</text><br><br>
       <input type="text" id="DatabaseName" ></input> <br> 
       <button type="button" onClick="addDatabase('DatabaseName', 'AddDatabaseHashId')">Add</button><br> 
       <text id="AddDatabaseHashId"></text>
    </div>
</body>
</html>

