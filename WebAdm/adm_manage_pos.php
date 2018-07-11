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
    var web3;
    if (doesLocalWeb3js()) {
        web3 = setupWeb3js();
    } else {
        //Metamask
        web3 = new Web3(web3.currentProvider);
    }
    
    var AdmAdvAdr = "<?php echo $htmlObjects->readObjectAddress('AdmAdv')?>";
    var posManager = new ZSCPosManagement(AdmAdvAdr, cC_getContractAbi('AdmAdv'));

</script>
</head>
<body>

<?php echo $htmlObjects->loadHeader();?>

<div class="page-header"><font size="5" color="blue" >Manage ZSC users</font></div>
    <div class="well" id="PosManagement"> </div>

<script type="text/javascript">
    window.addEventListener('load', function() {
    }); 
</script>

</body>
</html>
