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
            loadPublishedAgrsHtml("loadTemplatesPage", "showAgrParameters", "loadPublishOperation");
        });
    }

    function loadTemplatesPage() {
        window.location.href = "insura_tmp.php";
    }

    function loadPublishOperation(logId, agrName) {
        providerAgrGM.publishAgreement(logId, agrName, function() {
            loadPublishedAgrs();
        });
    }

    function showAgrParameters(name) {
        paraGM.setElementName(name);
        paraGM.loadParameterNamesAndvalues(function() {
            loadAgrParametersHtml("loadPublishedAgrs");
        });
    }

    function loadPublishedAgrsHtml(backFunc, funcShowPara, publishFunc) {
        var funcShowParaPrefix = funcShowPara + "('"; 
        var funcShowParaSuffix = "')";
    
        var backFuncFull = backFunc + "()";

        var publishPrefix = publishFunc + "('PublishAgreementHash', '";
        var publishSuffix = "')";

        var titlle = "provider's [tmp: " + providerAgrGM.getTmpName() + "] agreements: "
    
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';

        text += '<div class="well">';
        text += '   <button align="center" type="button" onClick="' + backFuncFull + '">Back</button>'
        text += '   <text id="Back"></text>'
        text += '</div>'

        text += '<div class="well">';
        text += '<text> Publishing agreement: </text> <text id="PublishAgreementHash"> </text> <br>'
   
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '<tr>'
        text += '   <td>Name</td> <td>Balance </td> <td>Status </td>  <td>Details </td> <td>Publish </td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td> <td>---</td>  </tr>'

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
            text += '   <td><button type="button" onClick="' + publishPrefix + agrName + publishSuffix + ' ">Publish</button></td>'
            text += '</tr>'
            text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td>  </tr>'
        }
        text += '</table></div>'
    
        document.getElementById("PageBody").innerHTML = text;  
    }


    function loadAgrParametersHtml(backFunc) {
        var functionInput = backFunc + "()";

        //var titlle = userLogin.getUserType() + " [" + userLogin.getUserName() + "] - profile: " 
        var titlle = "Agreement: " + paraGM.getElementName(); 
       
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';

        text += '<div class="well">';
        text += '   <button align="center" type="button" onClick="' + functionInput + '">Back</button>'
        text += '   <text id="Back"></text>'
        text += '</div>'

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
    
        var paraNos, paraName, paraValue;
        paraNos = paraGM.getParaNos();
    
        for (var i = 0; i < paraNos; ++i) {
            paraName  = paraGM.getParaName(i);
            paraValue = paraGM.getParaValue(i);
            text += '<tr>'
            text += '  <td> <text>' + paraName + ': </text> </td>'
            text += '  <td> <input type="text" id="' + paraName + '" value="' + paraValue + '"></input> </td>'
            text += '</tr>'
        }
        text += '</table></div>'


        document.getElementById("PageBody").innerHTML = text;  
    }

</script>

</body>
</html>
