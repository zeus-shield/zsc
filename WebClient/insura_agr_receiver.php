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
    var revAgrGM;
    var paraGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                revAgrGM = new ZSCAgreementReceiver(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                loadPurchasedAgrs();
            }
        });
    });

    /////////////////////////////
    function loadPurchasedAgrs() {
        revAgrGM.loadAgreements(function() {
            loadPurchasedAgrsHtml("showPurchasedAgrParameters");
        });        
    }

    function showAgrParameters(name) {
        paraGM.setElementName(name);
        paraGM.loadParameterNamesAndvalues(function() {
            loadPurchasedAgrParasHtml("loadPurchasedAgrs");
        });
    }

    function loadPurchasedAgrsHtml(funcShowPara) {
        var funcShowParaPrefix = funcShowPara + "('"; 
        var funcShowParaPrefix = "')";
    
        var titlle = "Purchased agreements: "

        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';

        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '<tr><td>Name</td> <td>Balance </td> <td>Details </td></tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td> </tr>'

        var agrName;
        for (var i = 0; i < this.agrNos; ++i) {
            agrName = revAgrGM.getAgrName(i);
            text += '<tr>'
            text += '   <td><text>' + agrName + '</text></td>'
            text += '   <td><text>' + revAgrGM.getAgrBalance(i)  + '</text></td>'
            text += '   <td><text>' + revAgrGM.getAgrStatus(i)  + '</text></td>'
            text += '   <td><button type="button" onClick="' + funcShowParaPrefix + agrName + funcShowParaSuffix + '">Show</button></td>'
            text += '</tr>'
            text += '<tr> <td>---</td> <td>---</td> <td>---</td>  </tr>'
        }
        text += '</table></div>'
        document.getElementById("PageBody").innerHTML = text;  
    }

    function loadPurchasedAgrParasHtml(claimFunc, backToAgr) {
        var claimInput = claimFunc + "()";
        var backFunc = backToAgr + "()";

        var titlle = "Agreement: " + agrName; 
       
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';

        text += '<div><button type="button" onClick="' + backFunc + '">Back</button></div>'

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
        text += '   <button type="button" onClick="' + claimInput + '">Claim reward</button>'
        text += '   <text id="Back"></text>'
        text += '</div>'

        document.getElementById("PageBody").innerHTML = text;  
    }

</script>

</body>
</html>
