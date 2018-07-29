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

    function loadTemplatsHtml(showFunc, purchaseFunc) {
        var showPrefix = showFunc + "('"; 
        var showSuffix = "')";
    
        var purchasePrefix = purchaseFunc + "('"; 
        var purchaseSuffix = "')";
    
        var titlle = "All published agreements: "
    
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
    
        text += '<div class="well">';
        text += '<text> Purchase agreement: </text> <text id="PurchaseAgreementHash"> </text>'
        text += '</div>';
    
        text += '<tr>'
        text += '   <td>Index</td> <td>Name</td> <td>Status</td> <td> Details </td> <td> Purchase </td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td> </tr>'
    
        for (var i = 0; i < this.allAgrNos; ++i) {
            if (this.allAgrStatus[i] == "PUBLISHED") {
                text += '<tr>'
                text += '   <td><text>' + i + '</text></td>'
                text += '   <td><text>' + this.allAgrNames[i] + '</text></td>'
                text += '   <td><text>' + this.allAgrStatus[i] + '</text></td>'
                text += '   <td><button type="button" onClick="' + showPrefix + this.allAgrNames[i] + showSuffix + '">Details</button></td>'
                if (this.userType == "receiver") {
                    text += '   <td><button type="button" onClick="' + purchasePrefix + this.allAgrNames[i] + purchaseSuffix + '">Purchase</button></td>'
                }
                text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td></tr>'
                text += '</tr>'
            }
        }
        text += '</table></div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

    function loadParametersHtml(tmpName, funcName) {
        var functionInput = funcName + "()";
    
        //var titlle = userLogin.getUserType() + " [" + userLogin.getUserName() + "] - profile: " 
        var titlle = "Template: " + tmpName; 
       
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
    
        var paraNos, paraName, paraValue;
        paraNos = userProfile.getParaNos();
    
        for (var i = 0; i < paraNos; ++i) {
            paraName  = paraGM.getParaName(i);
            paraValue = paraGM.getParaValue(i);
            text += '<tr>'
            text += '  <td> <text>' + paraName + ': </text> </td>'
            text += '  <td> <input type="text" id="' + paraName + '" value="' + paraValue + '"></input> </td>'
            text += '</tr>'
        }
        text += '</table></div>'
        text += '<div>'
        text += '   <button type="button" onClick="' + functionInput + '">Submit Changes</button>'
        text += '   <text id="Back"></text>'
        text += '</div>'

        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
