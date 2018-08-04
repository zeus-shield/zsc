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
    var tmpName = <?php echo "'".$_GET["tmpName"]."'";?>;
    var userLogin;
    var providerAgrGM;
    var paraGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) {  
                window.location.href = "index.php";
            } else {
                paraGM = new ZSCElement(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                providerAgrGM = new ZSCAgreementProvider(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                providerAgrGM.setTmpName(tmpName);
                loadPublishedAgrs();
            }
        });
    });

    /////////////////////////////
    function loadPublishedAgrs() {
        providerAgrGM.loadAgreements(function() {
            loadPublishedAgrsHtml();
        });
    }

    function showTemplateParameters(name) {
        paraGM.setElementName(name);
        paraGM.loadParameterNamesAndvalues(function() {
            loadAgrParametersHtml(temp, "loadPublishedAgrs");
        });
    }

    function loadPublishedAgrsHtml(funcShowPara) {
        var funcShowParaPrefix = funcShowPara + "('"; 
        var funcShowParaSuffix = "')";
    
        var titlle = "provider's [tmp: " + tmpName + "] agreements: "
    
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';    
        text += '<div class="well">';
        text += '<text> Publish agreement: </text> <text id="PublishAgreementHash"> </text>'
        text += '</div>';
    
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '<tr>'
        text += '   <td>Name</td> <td>Balance </td> <td>Status </td>  <td>Details </td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td>  </tr>'

        var nos = providerAgrGM.getAgrNos();
        var agrName, agrBalance, agrStatus;
    
        for (var i = 0; i < nos; ++i) {
            agrName = providerAgrGM.getAgrName(i);
            agrBalance = providerAgrGM.getAgrBalance(i);
            agrStatus  = providerAgrGM.getAgrStatus(i);

            text += '<tr>'
            text += '   <td><text>' + agrName + '</text></td>'
            text += '   <td><text>' + agrBalance + '</text></td>'
            text += '   <td><text>' + agrStatus + '</text></td>'
            text += '   <td><button type="button" onClick="' + funcShowParaPrefix + agrName + funcShowParaSuffix + ' ">Show</button></td>'
            text += '</tr>'
            text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td>  </tr>'
        }
        text += '</table></div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }


    function loadAgrParametersHtml(agrName, backFunc) {
        var functionInput = backFunc + "()";
    
        //var titlle = userLogin.getUserType() + " [" + userLogin.getUserName() + "] - profile: " 
        var titlle = "Agreement: " + agrName; 
       
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
