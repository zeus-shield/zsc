
<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<html>
<head>
<?php 
include("adm_header.php");

    $htmlObjects = new ZSCHtmlObjects();
    echo $htmlObjects->loadScriptFiles();
?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
    function gotoConfigureLogRecorder() {
        var href = "adm_configure_logrecorder.php" + cC_getUrlSuffixForControlPage();
        window.location.href = href;
    }

</script>
</head>
<body>

<?php 
    echo $htmlObjects->loadHeader();

    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';
    echo $htmlObjects->loadAllAdrs();

    echo $htmlObjects->loadCreateContract('cC_setupContract');
?>
    <div class="well">
        <button type="button" onClick="gotoConfigureLogRecorder()">Next: configure log recorder</button>
    </div>

</body>
</html>



