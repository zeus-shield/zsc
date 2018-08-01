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
        templateGM.submitPurchaseAgreement(elementName, function(result) {
            loadHtmlPageBody("agreement-all")
        });
    }

    function loadTemplatsHtml(showAgrs, funcCreateTmp, funcSetPara, funcPublish) {
        var showAgrsPrefix = showAgrs + "('";
        var showAgrsSuffix = "')";

        var funcCreateTmpFull = funcCreateTmp + "('CreateNewTemplateHash')"; 

        var funcSetParaPrefix = funcSetPara + "('"; 
        var funcSetParaSuffix = "')";
    
        var funcPublishPrefix = funcPublish + "('";
        var funcPublishSuffix = "')";
    
        var text ="";
    
        var titlle = "Templates info"
    
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
    
        text += '<div class="well">';
        text += '   <td><button type="button" onClick="' + funcCreateTmpFull + '">Create New Template</button></td> <br>'
        text += '   <text id="CreateNewTemplateHash"> </text>'
        text += '</div>';
    
        text += '<div class="well">';
        text += '   <div class="well">';
        text += '      <text> Note - 1: "Adding" is to create one insurance agreement from a template. </text><br>'
        text += '      <text> Note - 2: Due to the confirmation time on the (Rinkeby) Ethereum platform, need to add one by one. </text><br>'
        text += '      <text> Adding agreement: </text> <text id="CreateNewAgreementHash"> </text>'
        text += '   </div>';
        text += '<table align="center" style="width:700px;min-height:30px">'
        text += '<tr>'
        text += '   <td>Name</td> <td>Details</td> <td>Add as Agreement </td>   <td>Added Nos. </td>  <td>  </td> '
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> </tr>'

        var tmpName;
        var childrenNos;

        for (var i = 0; i < templateGM.getTemplateNos(); ++i) {
            tmpName = templateGM.getTmpName(i);
            childrenNos = templateGM.getTmpChildrenNos(i);

            text += '<tr>'
            text += '   <td><text>' + tmpName + '</text></td>'
            text += '   <td><button type="button" onClick="' + funcSetParaPrefix + tmpName + funcSetParaSuffix + '">Edit</button></td>'
            text += '   <td><button type="button" onClick="' + funcPublishPrefix + i + funcPublishSuffix + '">Add</button></td>'
            text += '   <td><text>' + childrenNos  + '</text></td>'
            text += '   <td><button type="button" onClick="' + showAgrsPrefix + tmpName + showAgrsSuffix + '">List</button></td>'
            text += '</tr>'
            text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> </tr>'
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
