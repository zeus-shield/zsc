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
    var allAgrGM;
    var zscParaGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) {  
                window.location.href = "index.php";
            } else {
                zscParaGM = new ZSCElement(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                allAgrGM = new ZSCAgreementAll(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                allAgrGM.setUserType(userType);
                loadAllAgreements();
            }
        });
    });

    /////////////////////////////
    function loadAllAgreements() {
        allAgrGM.loadAllAgreements(function() {
            loadAllAgreementsHtml("showAgreementParameters", "submitPurchaseAgreement");
        });
    }

    function showAgreementParameters(agrName) {
        zscParaGM.setElementName(agrName);
        zscParaGM.loadParameterNamesAndvalues(function() {
            loadParametersHtml(agrName, "loadAllAgreements");
        });
    }

    function submitPurchaseAgreement(elementName) {
        allAgrGM.submitPurchaseAgreement(elementName, function() {
            loadAllAgreements();
        });
    }

    function loadAllAgreementsHtml(showFunc, purchaseFunc) {
        var showPrefix = showFunc + "('"; 
        var showSuffix = "')";
    
        var purchasePrefix = purchaseFunc + "('"; 
        var purchaseSuffix = "')";
    
        var titlle = "All published agreements: "
    
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';
        text += '<text> Purchase agreement: </text> <text id="PurchaseAgreementHash"> </text> <br><br>'

        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '<tr>'
        text += '   <td>Index</td> <td>Name</td> <td>Status</td> <td> Details </td> <td> Purchase </td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td> </tr>'

        var agrStatus, agrName, agrNos;
        agrNos =  allAgrGM.numAgrs();
    
        for (var i = 0; i < agrNos; ++i) {
            agrStatus = allAgrGM.getAgrStatus(i);
            agrName = allAgrGM.getAgrName(i);
            if (agrStatus == "PUBLISHED") {
                text += '<tr>'
                text += '   <td><text>' + i + '</text></td>'
                text += '   <td><text>' + agrName + '</text></td>'
                text += '   <td><text>' + agrStatus + '</text></td>'
                text += '   <td><button type="button" onClick="' + showPrefix + agrName + showSuffix + '">Details</button></td>'
                if (allAgrGM.getUserType() == "receiver") {
                    text += '   <td><button type="button" onClick="' + purchasePrefix + agrName + purchaseSuffix + '">Purchase</button></td>'
                } else {
                    text += '   <td><text> Not available</text></td>'
                }
                text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td></tr>'
                text += '</tr>'
            }
        }
        text += '</table></div>'
    
        document.getElementById("PageBody").innerHTML = text;  
    }

    function loadParametersHtml(agrName, backFunc) {    
        var functionInput = backFunc + "()";
        var titlle = "Agreement: " + agrName; 
       
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';

        text += '<div class="well">'
        text += '   <button type="button" onClick="' + functionInput + '">Back</button>'
        text += '   <text id="Back"></text>'
        text += '</div>'
        
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
    
        var paraNos, paraName, paraValue;
        paraNos = zscParaGM.getParaNos();
    
        for (var i = 0; i < paraNos; ++i) {
            paraName  = zscParaGM.getParaName(i);
            paraValue = zscParaGM.getParaValue(i);
            text += '<tr>'
            text += '  <td> <text>' + paraName + ': </text> </td>'
            text += '  <td> <text>' + paraValue + ' </text> </td>'
            text += '</tr>'
        }
        text += '</table></div>'

        document.getElementById("PageBody").innerHTML = text;  
    }


</script>

</body>
</html>
