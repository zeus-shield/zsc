

<?php include("adm_header.php"); ?>

<?php
$urlSuffixTag = false;

?>


<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function initSystemModule(module) {
        var adrs = <?php echo getLogedModuleAddressArrayInString()?>;
        sF_initSystemModule(module, adrs, module + "Hash");
    }

    function setControlApisAdvAbi(elementId) {
        var adr = "<?php echo readModuleAddress('ControlApisAdv')?>";
        sF_setControlAbisAdvAbi(adr, elementId);
    }
    
</script>
</head>
<body>

<div class="well">
        <text>Step - 1 </text>
        <button type="button" onClick="initSystemModule('DBDatabase')">Init DBDatabase</button> 
        <text id="DBDatabaseHash"></text><br>

        <br><text>Step - 2 </text>
        <button type="button" onClick="initSystemModule('FactoryPro')">Init FactoryPro</button>
        <text id="FactoryProHash"></text><br>

        <br><text>Step - 3 </text>
        <button type="button" onClick="initSystemModule('ControlApisAdv')">Bind Factories</button> 
        <text id="ControlApisAdvHash"></text> <br>

        <br><text>Step - 4 </text>
        <button type="button" onClick="setControlApisAdvAbi('ControlApisAdvAbiHash')">Set ControlApisAdv Abi</button> <br>
        <text id="ControlApisAdvAbiHash"></text> <br>
        <text id="ControlApisAdvAbi"> </text> 

</div>
</body>
</html>

