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
    var userLogin;
    var userProfile;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(function(ret) { 
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                userProfile = new ZSCElement(account, "null", userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                loadUserProfile();
            }
        });

        
    });
    /////////////////////////////

    function loadHtml(elementId, funcName) {
        var functionInput = funcName + "('UpdateParameterHash')";
    
        var titlle = userLogin.getUserType() + " [" + userLogin.getUserName() + "] - profile: " 
       
        var text ="";
        text += '<div class="well"> <text>' + titlle + ' </text></div>';
        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
    
        var paraName;
    
        for (var i = 0; i < userProfile.numParameters(); ++i) {
            text += '<tr>'
            text += '  <td> <text>' + paraName + ': </text> </td>'
            text += '  <td> <input type="text" id="' + userProfile.getParameter(i) + '" value="' + userProfile.getValue(i) + '"></input> </td>'
            text += '</tr>'
        }
        text += '<div>'
        text += '   <button type="button" onClick="' + functionInput + '">Submit Changes</button>'
        text += '   <text id="UpdateParameterHash"></text>'
        text += '</div>'

        document.getElementById(elementId).innerHTML = text;  
    }

    function submitParameterProfileChanges(logID) {
        userProfile.setElementParameter(logID, function(){});
    }

    function loadUserProfile() {
        userProfile.getRegisteredUserName(function() {
        userProfile.loadParameterNamesAndvalues(function() {
            loadHtml("PageBody", "submitParameterProfileChanges");
        });
      });
    }

</script>

</body>
</html>
