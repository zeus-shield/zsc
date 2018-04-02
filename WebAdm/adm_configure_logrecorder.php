

<?php include("adm_header.php"); ?>

<?php
$urlSuffixTag = false;
function storSystemModuleAdrs() {
    $system_modules = getModuleArray();
    $num = count($system_modules);
    
    for($x = 0; $x < $num; $x++) {
        $module = $system_modules[$x];
        $adr = $_GET[$module];

        if(!empty($adr)){
            $urlSuffixTag = true;
            writeModuleAddress($module, $adr);
        }
    }
}
?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
    
</script>
</head>
<body>
<?php echo includeHeader();?>
    <div class="page-header"> <font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>
    <?php echo includAllAdrs();?>
</body>
</html>

