<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
session_start();
?>

<html>
<head>
<?php 
    include("include.php");
    $htmlObjects = new ZSCInclude($_SESSION["userType"]);
    echo $htmlObjects->loadScriptFiles(); 
?>
</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div class="well" id="PageAlert"><?php echo $htmlObjects->loadAlert(); ?></div>
        <div class="well" id="PageHeader"><?php echo $htmlObjects->loadHeader(); ?></div>
        <div class="well" id="PageBody"></div>
    </div>

<script type="text/javascript">
    /////////////////////////////
    <?php echo $htmlObjects->loadWeb3();?>
    var checkeWeb3Account = <?php echo $htmlObjects->checkWeb3Account();?>;
    var userType = <?php echo "'".$_SESSION["userType"]."'";?>;
    var userLogin;
    var templateGM;
    var paraGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                templateGM = new ZSCTemplate(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                loadTemplates();
            }
        });
    });

    /////////////////////////////
    function loadTemplates() {
        templateGM.loadTempates(function() {
            loadHtml("showTemplateParameters", "purchaseAgreement");
        });
    }

    function showTemplateParameters(tmpName) {
        var temp = tmpName;
        paraGM = new ZSCElement(account, tmpName, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
        paraGM.loadParameterNamesAndvalues(function() {
            loadParametersHtml(temp, "loadTemplates");
        });
    }

    function submitPurchaseAgreement(elementName) {
        zscAgrsAllGM.submitPurchaseAgreement(elementName, function(result) {
            loadHtmlPageBody("agreement-all")
        });
    }

    

</script>

</body>
</html>
