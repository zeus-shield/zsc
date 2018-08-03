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
    var userRobotGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                userRobotGM = new ZSCRobotOwned(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                loadUserRobots();
            }
        });
    });

    /////////////////////////////
    function loadUserRobots() {
        userRobotGM.loadUserRobots(function() {
            loadHtml("PageBody", "transferToOther");
        });
    }

    function transferToOther(hashId, destId, robotId) {
        var dest = document.getElementById(destId).value;
        userRobotGM.transferToOther(hashId, dest, robotId);
    }

    function loadHtml(elementId, transfer) {
        var transferPrifix, transferSuffix;
        transferPrifix = transfer + "('OperationHash', 'DestAdr', '"; 
        transferSuffix = "')";

        var robotNos = userRobotGM.getRobotNos();
    
        var titlle = "Transfer robots: Inner wallet -> Outside wallet" 

        text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'

        if ("true" === fromSystemWallet) {
            text += '   <tr> <td>Robot ID</td> <td>Status</td> <td>Level</td> <td>Max SP</td> <td>Take out to MetaMask</td> </tr> '
        } else {
            text += '   <tr> <td>Robot ID</td> <td>Status</td> <td>Level</td> <td>Max SP</td> <td>Transfer from MetaMask</td> </tr> '
        }
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'

        for (var i = 0; i < robotNos; ++i) {
            var robotId = userRobotGM.getRobotId(i);
            var status = "Idle"; 
            if (!userRobotGM.miningable(i)) {
                status = "Mining";
            } else {
                if (userRobotGM.getPriceForSale(i) > 0) {
                    status = "Selling";
                } 
            }
    
            text += '<tr>'
            text += '   <td><text>' + robotId + '</text></td>'
            text += '   <td><text>' + status + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotLev(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getMaxSP(i) + '</text></td>'
            if (status == "Idle") {
                text += '   <td><input style="width:200px" id="DestAdr"></input><br>'
                text += '   <button type="button" onClick="' + transferPrifix + robotId + transferSuffix + '"> Transfer to </button></td>'
            } else {
                text += '   <td><text>Not Available</text></td>'
            }
            text += '</tr>'
            text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td>  </tr>'
        }
        text += '</table>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
