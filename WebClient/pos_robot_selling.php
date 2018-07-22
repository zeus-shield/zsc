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
    var userRobotGM;

    checkeWeb3Account(function(account) {
        userLogin = new ZSCLogin(account);
        userLogin.tryLogin(function(ret) { 
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
            loadHtml("PageBody", "sellRobot", "cancelSelling");
        });
    }

    function sellRobot(hashId, robotId, priceId) {
        var price = document.getElementById(priceId).value;
        userRobotGM.publishMinerRobot(hashId, robotId, price, function() {                
        });
    }

    function cancelSelling(hashId, robotId) {
        userRobotGM.cancalSellingMinerRobot(hashId, robotId, function() {                
        });
    }

    function loadHtml(elementId, sellRobot, cancleSelling) {
        var sellPrefix = sellRobot + "('OperationHash', '"; 
        var sellSuffix = "')";

        var cancelPrefix = cancleSelling + "('OperationHash', '"; 
        var cancelSuffix = "')";

        var symbol;
        var adr;
        var balance;
        var hashId;
        var robotNos = userRobotGM.getRobotNos();
    
        var titlle = "user owned robots: " 

        text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>Robot ID</td> <td>Status</td> <td>Level</td> <td>Max SP</td> <td> Price (ETH) </td> <td> Sell </td> <td> Cancel </td></tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'

        for (var i = 0; i < robotNos; ++i) {
            var robotId = userRobotGM.getRobotId(i);
            var status = "Idle"; 
            var priceId = "Price-" + robotId;

            if (!userRobotGM.miningable(i)) {
                status = "Mining";
            } else {
                if (userRobotGM.getPriceForSale(i) > 0) {
                    status = "Selling";
                } 
            }

            if (status != "Mining") {
                text += '<tr>'
                text += '   <td><text>' + robotId + '</text></td>'
                text += '   <td><text>' + status + '</text></td>'
                text += '   <td><text>' + userRobotGM.getRobotLev(i) + '</text></td>'
                text += '   <td><text>' + userRobotGM.getMaxSP(i) + '</text></td>'

                if (status == "Idle") {
                    text += '   <td><input style="width:100px" id="' + priceId + '"></input><br>'
                    text += '   <td><button type="button" onClick="' + sellPrefix + robotId + "', '" + priceId + "', '" + sellSuffix + '"> Sell </button></td>'
                } else {
                    text += '   <td><text>--</text></td>'
                    text += '   <td><text>--</text></td>'
                }

                if (status == "Selling") {
                    text += '   <td><button type="button" onClick="' + cancelPrefix + robotId + cancelSuffix + '"> Cancel </button></td>'
                } else {
                    text += '   <td><text>--</text></td>'
                }
                text += '</tr>'
                text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'
            }
        }
        text += '</table>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
