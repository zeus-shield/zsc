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
    var zscUserType = <?php echo "'".$_SESSION["userType"]."'";?>;
    var zscUserLogin;
    var zscUserProf;

    checkeWeb3Account(function(account) {
        zscUserLogin = new ZSCLogin(account);
        zscUserLogin.tryLogin(zscUserType, function(ret) {
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                zscUserProf = new ZSCElement(account, zscUserLogin.getControlApisAdr(), zscUserLogin.getControlApisFullAbi());
                zscUserProf.setElementName("null");
                loadzscUserProf();
            }
        });

        
    });
    /////////////////////////////

    function loadHtml(elementId, funcName) {
        var functionInput = funcName + "('UpdateParameterHash')";
    
        //var titlle = zscUserLogin.getzscUserType() + " [" + zscUserLogin.getUserName() + "] - profile: " 
        var titlle = "User profile:"; 
       
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
    
        var paraNos, paraName, paraValue;
        paraNos = zscUserProf.getParaNos();
    
        for (var i = 0; i < paraNos; ++i) {
            paraName  = zscUserProf.getParaName(i);
            paraValue = zscUserProf.getParaValue(i);
            text += '<tr>'
            text += '  <td> <text>' + paraName + ': </text> </td>'
            text += '  <td> <input type="text" id="' + paraName + '" value="' + paraValue + '"></input> </td>'
            text += '</tr>'
        }
        text += '</table></div>'

        text += '<div>'
        text += '   <button type="button" onClick="' + functionInput + '">Submit Changes</button>'
        text += '   <text id="UpdateParameterHash"></text>'
        text += '</div>'

        document.getElementById(elementId).innerHTML = text;  
    }

    function submitParameterProfileChanges(logID) {
        zscUserProf.setElementParameter(logID, function(){ window.location.reload(true); });
    }

    function loadzscUserProf() {
        zscUserProf.loadParameterNamesAndvalues(function() {
            loadHtml("PageBody", "submitParameterProfileChanges");
        });
    }

</script>

</body>
</html>
