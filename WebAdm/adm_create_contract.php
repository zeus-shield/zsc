
<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<html>
<head>
<?php 
    include("adm_header.php"); 
    $htmlModules= new ZscHtmlModules();
    echo $htmlModules->loadScriptFiles();
?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    function gotoConfigureLogRecorder() {
        window.location.href="adm_configure_logrecorder.php" + cC_getUrlSuffixForControlPage();
    }
</script>
</head>
<body>

<?php 
    echo $htmlModules->loadHeader();

    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';

    echo $htmlModules->loadAllAdrs();
    echo $htmlModules->loadCreateContract('cC_setupContract');
    echo '<div class="well">
            <button type="button" onClick="gotoConfigureLogRecorder()">Next: configure log recorder</button>
         </div>';
?>

</body>
</html>



