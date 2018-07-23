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
    var robotMarketGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(userType, function(ret) {
            if(!ret) { 
                window.location.href = "index.php";
            } else {
                robotMarketGM = new ZSCRobotMarket(account, userLogin.getControlApisAdr(), userLogin.getControlApisFullAbi());
                loadRobotsInMarket();
            }
        });
    });

    /////////////////////////////
    function loadRobotsInMarket() {
        robotMarketGM.loadRobotsInMarket(function() {
            loadHtml("PageBody", "purchaseSellingRobot");
        });
    }

    function purchaseSellingRobot(hashId, robotId) {
        robotMarketGM.purchaseSellingRobot(hashId, robotId, function() {                
        });
    }

    function loadHtml(elementId, purchase) {
        var purchasePrefix = purchase + "('OperationHash', '"; 
        var purchaseSuffix = "')";

        var robotNos = robotMarketGM.getRobotNos();
    
        var titlle = "Robot markets" 

        text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>Robot ID</td> <td>Level</td> <td>Max SP</td> <td> Price (ETH) </td> <td> Purchase </td> </tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'

        for (var i = 0; i < robotNos; ++i) {
            var robotId = robotMarketGM.getRobotId(i);

            text += '<tr>'
            text += '   <td><text>' + robotId + '</text></td>'
            text += '   <td><text>' + robotMarketGM.getRobotLev(i) + '</text></td>'
            text += '   <td><text>' + robotMarketGM.getMaxSP(i) + '</text></td>'
            text += '   <td><text>' + robotMarketGM.getPriceForSale(i) + '</text></td>'
            text += '   <td><button type="button" onClick="' + purchasePrefix + robotId + purchaseSuffix + '"> Purchase </button></td>'
            text += '</tr>'
            text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'
        }
        text += '</table>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
