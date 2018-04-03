

<?php include("adm_header.php"); ?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
</script>
</head>
<body>

<?php echo includeHeader();?>

<div class="page-header"><font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>

<?php echo includAllAdrs();?>

<text>Log:</text>
<div class="well">
    <button type="button" onClick="<?php echo "sF_changeLogerModule('".readModuleAddress("DBDatabase")."')"?>">DBDatabase</button> 
    <button type="button" onClick="<?php echo "sF_changeLogerModule('".readModuleAddress("FactoryPro")."')"?>">FactoryPro</button> 
    <button type="button" onClick="<?php echo "sF_changeLogerModule('".readModuleAddress("ControlApisAdv")."')"?>">ControlApisAdv</button>  <br>
    <text id = "SystemLog">Log:</text> <br>
</div>
<script type="text/javascript">
    var adrs = <?php echo getLogedModuleAddressArrayInString()?>;
    sF_initSystemModule("SystemLog", adrs, module + "Hash");
</script>      
</body>
</html>

