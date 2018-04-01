
<?php include("adm_header.php"); ?>

<html>
<head>
<?php echo includeScriptFiles();?>

<script type="text/javascript">
    var web3 = setupWeb3js(false);
    function gotoConfigureLogRecorder() {
        window.location.href="adm_configure_logrecorder.php" + cC_getUrlSuffixForControlPage();
    }
</script>
</head>
<body>
    <?php echo includeHeader();?>

    <div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>

    <?php echo includAllAdrs();?>

    <text>Step - 0: Create log_recorder</text>
    <div class="well">
         <text>Loger Name: </text>                    
         <input type="text" id="LogRecorderName" value = "zsc_loger"></input> 
         <button type="button" onClick="cC_setupContract('LogRecorder', 'LogRecorderName')">Create</button> <br>
         <text id="LogRecorderLog"></text> <br>
    </div>
    <text>Step - 1: Create db_database</text>
    <div class="well">
         <text>Database Name: </text>                    
         <input type="text" id="DBdatabaseName" value = "zsc_db"></input> 
         <button type="button" onClick="cC_setupContract('DBDatabase', 'DBdatabaseName')">Create</button> <br>
         <text id="DBDatabaseLog"></text> <br>
    </div>
    <text>Step - 2: Create factory_pro</text>
    <div class="well">
         <text>FactoryPro Name: </text>                    
         <input type="text" id="FactoryProName" value = "zsc_factory_pro"></input> 
         <button type="button" onClick="cC_setupContract('FactoryPro', 'FactoryProName')">Create</button> <br>
         <text id="FactoryProLog"></text>
    </div>
    <text>Step - 3: Create control_apis</text>
    <div class="well">
        <text>FactoryPro Name: </text>                    
        <input type="text" id="ControlApisAdvName" value = "zsc_control_apis"></input> 
        <button type="button" onClick="cC_setupContract('ControlApisAdv', 'ControlApisAdvName')">Create</button> <br>
        <text id="ControlApisAdvLog"></text>
    </div>
    <div class="well">
        <button type="button" onClick="gotoConfigureLogRecorder()">Next: configure log recorder</button>
    </div>

</body>
</html>



