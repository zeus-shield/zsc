

<?php include("adm_header.php"); ?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function changeLogerModule(name) {
    }
     
</script>
</head>
<body>

<?php echo includeHeader();?>

<div class="page-header"><font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>

<?php echo includAllAdrs();?>

<text>Log:</text>
<div class="well">
    <button type="button" onClick="<?php echo "changeLogerModule('".readModuleAddress("DBDatabase")."')"?>">DBDatabase</button> 
    <button type="button" onClick="<?php echo "changeLogerModule('".readModuleAddress("FactoryPro")."')"?>">FactoryPro</button> 
    <button type="button" onClick="<?php echo "changeLogerModule('".readModuleAddress("ControlApisAdv")."')"?>">ControlApisAdv</button>  <br>
    <text id = "SystemLog">Log:</text> <br>
</div>

</body>
</html>

