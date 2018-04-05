<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>


<?php
include("adm_header.php");
$htmlModules= new ZscHtmlModules();
?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function initSystemModule(module, extraInfo, elementId) {
        var adrs = <?php echo $htmlModules->getLogedModuleAddressArrayInString()?>;
        sF_initSystemModule(module, extraInfo, adrs, elementId);
    }

    function setControlApisAdvAbi(elementId) {
        var adr = "<?php echo $htmlModules->readModuleAddress('ControlApisAdv')?>";
        sF_setControlAbisAdvAbi(adr, elementId);
    }
    
</script>
</head>
<body>
<?php echo $htmlModules->loadScriptFiles(); ?>

<div class="well">
        <<text>Step - 0 </text>
        <button type="button" onClick="setControlApisAdvAbi('ControlApisAdvAbiHash', '0')">Set ControlApisAdv Abi</button> <br>
        <text id="ControlApisAdvAbiHash"></text> <br>
        <text id="ControlApisAdvAbi"> </text> <br>

        <text>Step - 1 </text>
        <button type="button" onClick="initSystemModule('DBDatabase', 'null','DBDatabaseHash')">Init DBDatabase</button> 
        <text id="DBDatabaseHash"></text><br>

        <text>Step - 2 </text>
        <button type="button" onClick="initSystemModule('AdmAdv', 'null','AdmAdvHash')">Init DBDatabase</button> 
        <text id="AdmAdv"></text><br>

        <br><text>Step - 3 </text>
        <button type="button" onClick="initSystemModule('FactoryPro', 'null', 'FactoryProHash')">Init FactoryPro</button>
        <text id="FactoryProHash"></text><br>

        <br><text>Step - 4 </text>
        <button type="button" onClick="initSystemModule('FactoryTmp', 'null', 'FactoryTmpHash')">Init FactoryPro</button>
        <text id="FactoryProHash"></text><br>

        <br><text>Step - 5 </text>
        <button type="button" onClick="initSystemModule('FactoryAgr', 'null', 'FactorAgrpHash')">Init FactoryPro</button>
        <text id="FactoryProHash"></text><br>

        <br><text>Step - 6 </text>
        <button type="button" onClick="initSystemModule('ControlApisAdv', 'DBDatabase', 'ControlApisAdvHash-a')">Set Database</button>
        <text id="ControlApisAdvHash-a"></text><br>

        <br><text>Step - 7 </text>
        <button type="button" onClick="initSystemModule('ControlApisAdv', 'AdmAdv', 'ControlApisAdvHash-b')">Set AdmAdv</button>
        <text id="ControlApisAdvHash-b"></text><br>

        <br><text>Step - 8 </text>
        <button type="button" onClick="initSystemModule('ControlApisAdv', 'FactoryPro', 'ControlApisAdvHash-c')">Init FactoryPro</button>
        <text id="ControlApisAdvHash-c"></text><br>

        <br><text>Step - 9 </text>
        <button type="button" onClick="initSystemModule('ControlApisAdv', 'FactoryTmp', 'ControlApisAdvHash-d')">Init FactoryTmp</button>
        <text id="ControlApisAdvHash-d"></text><br>

        <br><text>Step - 10 </text>
        <button type="button" onClick="initSystemModule('ControlApisAdv', 'FactoryAgr', 'ControlApisAdvHash-e')">Init FactoryAgr</button>
        <text id="ControlApisAdvHash-e"></text><br>
</div>
</body>
</html>

