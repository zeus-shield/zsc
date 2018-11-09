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
        userLogin.getControlApisInfo(userLogin, function(ret) {
            userRobotGM = new ZSCRobotAllBreifes(account, userLogin.getErc721Adr(), userLogin.getControlApisFullAbi());
            loadAllSellingRobotBriefs();
        });
    });

    /////////////////////////////
    function loadAllSellingRobotBriefs() {
        userRobotGM.loadAllRobotBriefs("selling", 0x0, function() {
            loadAllSellingRobotHtml("PageBody", "showRobotDetails");
        });
    }

    function showRobotDetails(robotId) {
        window.location.href = "pos_robot_detail.php?robotId=" + robotId;
    }

    /////////////////////////    
    function loadAllSellingRobotHtml(elementId, showRobot) {
        var showPrefix = showRobot + "('"; 
        var showSuffix = "')";

        var robotNos = userRobotGM.getRobotNos();
        var titlle = "User owned robots" 

        text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>id</td> <td>rare</td> <td>spLev</td> <td>name</td> <td>selling price</td> <td> Details </td></tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td>  </tr>'

        for (var i = 0; i < robotNos; ++i) {
            //default paras: "id", "status", "rare", "spLev", 
            //this.robotParaBrief = ["spMax"];
            var robotId = userRobotGM.getRobotBriefParaValue("id",     i, "null");
            text += '<tr>'
            text += '   <td><text>' + robotId + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("rare",   i, "Rare") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("spLev",  i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("name",  i, "null") + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotBriefParaValue("sellPrice",  i, "FromWei") + '</text></td>'
            text += '   <td><button type="button" onClick="' + showPrefix + robotId + showSuffix + '"> Show </button></td>'
            text += '</tr>'
        }
        text += '</table>'
        text += '</div>'
        document.getElementById(elementId).innerHTML = text;  
    }

</script>
<?php echo $htmlObjects->loadEthereumEnable(); ?>

</body>
</html>
