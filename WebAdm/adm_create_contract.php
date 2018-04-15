
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
        var href = "adm_configure_logrecorder.php";
        href    += cC_getUrlSuffixForControlPage();
        href    += "zscTokenAddress=" + document.getElementById("CreateContractHtml").value;
        window.location.href = href;
    }

</script>
</head>
<body>

<?php 
    echo $htmlModules->loadHeader();

    echo '<div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>';
    echo $htmlModules->loadAllAdrs();

    echo '<text>Fill in ZSC token address </text> 
         <div class="well">
            <input type="text" id="zscTokenAddress"></input>
        </div><br>';

    echo $htmlModules->loadCreateContract('cC_setupContract');
?>
    <div class="well">
        <button type="button" onClick="gotoConfigureLogRecorder()">Next: configure log recorder</button>
    </div>

</body>
</html>



