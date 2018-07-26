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
            loadHtml("PageBody", "createGen0Robot", "enhanceRobot");
        });
    }

    function createGen0Robot(hashId) {
        userRobotGM.createGen0Robot(hashId, function(){});
    }

    function enhanceRobot(hashId, robotId) {
        userRobotGM.enhanceMinerRobot(hashId, robotId, function(){});
    }

    function loadHtml(elementId, createGen0, enhance) {
        var createGen0Func = createGen0 + "('OperationHash')"; 
        var enhancePrefix = enhance + "('OperationHash', '"; 
        var enhanceSuffix = "')";

        var symbol;
        var adr;
        var balance;
        var hashId;
        var robotNos = userRobotGM.getRobotNos();
    
        var titlle = "User owned robots" 

        text  = '<div class="well" align="center" >' + titlle + '<br>';
        text  = '<text id="OperationHash" value = "log:"> </text> </div>';

        text += '<div class="well" align="center" >'
        text += '   <button type="button" onClick="' + createGen0Func + '">  Create Lev0 ZSC miner robot (Cost 0.01ETH) </button> <br>'
        text += '</div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>Robot ID</td> <td>Status</td> <td>Level</td> <td>Max SP</td> <td> Cost (ETH) </td> <td>Upgrade (Up. Prob.) </td> </tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> </tr>'

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

            hashId  = symbol + "Hash";
            sentoId = symbol + "Dest";
            amountId= symbol + "Amount";
    
            text += '<tr>'
            text += '   <td><text>' + robotId + '</text></td>'
            text += '   <td><text>' + status + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotLev(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getMaxSP(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getPriceToEnhance(i) + '</text></td>'
            if (status == "Idle") {
                text += '   <td><button type="button" onClick="' + enhancePrefix + robotId + enhanceSuffix + '"> Up. (' + userRobotGM.getEnhanceProb(i) + '%)</button></td>'
            } else {
                text += '   <td><text>Not Available</text></td>'
            }
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
