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
                userRobotGM = new ZSCRobotOwned(account, userLogin.getErc721Adr(), userLogin.getControlApisFullAbi());
                loadUserRobots();
            }
        });
    });

    /////////////////////////////
    function loadUserRobots() {
        userRobotGM.loadUserRobots(true, function() {
            loadAllRobotHtml("PageBody", "showRobotDetails");
        });
    }

    function showRobotDetails(hashId, robotIndex) {
        userRobotGM.loadUserRobots(false, function() {
            loadHtml("PageBody", "loadUserRobots", "createGen0Robot", "enhanceRobot");
        });
    }

    function loadAllRobotHtml(elementId, showRobot) {
        var showPrefix = showRobot + "('OperationHash', '"; 
        var showSuffix = "')";

        var symbol;
        var adr;
        var balance;
        var hashId;
        var robotNos = userRobotGM.getRobotNos();
    
        var titlle = "User owned robots" 

        text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well" align="center" >'
        text += '   <button type="button" onClick="' + createGen0Func + '">  Create Lev0 miner robot (Cost 0.01ETH) </button> <br>'
        text += '</div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>id</td> <td>ctg</td> <td>status</td> <td>rare</td> <td>spLev</td> <td>upPrice</td> <td> Details </td></tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'

        for (var i = 0; i < robotNos; ++i) {
            //default paras: "id", "ctg", "status", "rare", "spLev", "createPrice", "upPrice"
            //this.robotParaBrief = ["spMax"];
            var robotId = userRobotGM.getRobotPara("id", false, i);
            var ctg = userRobotGM.getRobotPara("status", false, i); 
            var status = userRobotGM.getRobotPara("status", false, i); 

            hashId  = symbol + "Hash";
            sentoId = symbol + "Dest";
            amountId= symbol + "Amount";
    
            text += '<tr>'
            text += '   <td><text>' + userRobotGM.getRobotPara("id",      false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("ctg",     false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("status",  false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("rare",    false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("spLev",   false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("upPrice", false, i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotPara("spMax",   false, i) + '</text></td>'
            text += '   <td><button type="button" onClick="' + showPrefix + robotId + showSuffix + '"> Show </button></td>'
            text += '</tr>'
            text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> td>------</td> td>------</td> </tr>'
        }
        text += '</table>'
        text += '</div>'
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
