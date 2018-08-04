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
                loadPurchasedAgreements();
            }
        });
    });

    /////////////////////////////
    function loadPurchasedAgrs() {
        
    }

    function loadPurchasedAgrsHtml(funcShowPara) {
        var funcSetParaPrefix = funcSetPara + "('"; 
        var funcSetParaSuffix = "')";
    
        var funcPublishPrefix = funcPublish + "('"; 
        var funcPublishSuffix = "')";
    
        var titlle = "Purchased agreements: "

        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';

        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '<tr><td>Name</td> <td>Balance </td> <td>Details </td></tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td> </tr>'
    
        for (var i = 0; i < this.agrNos; ++i) {
            text += '<tr>'
            text += '   <td><text>' + this.agrNames[i]  + '</text></td>'
            text += '   <td><text>' + this.balance[i]  + '</text></td>'
            text += '   <td><text>' + this.status[i]  + '</text></td>'
            text += '   <td><button type="button" onClick="' + funcShowParaPrefix + this.agrNames[i] + funcShowParaSuffix + '">Show</button></td>'
            text += '</tr>'
            text += '<tr> <td>---</td> <td>---</td> <td>---</td>  </tr>'
        }
        text += '</table></div>'
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
