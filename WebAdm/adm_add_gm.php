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
    var timeStampAdr = "<?php echo $htmlObjects->readObjectAddress('TimeStamp')?>";
    var logedModuleAdrs = <?php echo $htmlObjects->getLogedObjectAddressArrayInString()?>;

    var web3 = setupWeb3js(false);
    //var web3 = new Web3(web3.currentProvider);
    
    var zscSetup = new ZSCSetup(recorderAdr, timeStampAdr, zscTokenAddress, logedModuleAdrs);

    function addGMModule(module, elementId) {
        zscSetup.addGMModule(module, elementId);
    }
</script>
</head>
<body>
<?php 
    echo $htmlObjects->loadHeader(); 
    echo '<div class="page-header"> <font size="5" color="blue" >Add Component - Manager </font></div>';
?>

    <div class="well">
        <?php echo $htmlObjects->loadAddGMs('addGMModule');?>
    </div>

</body>
</html>

