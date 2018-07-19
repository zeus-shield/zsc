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
    }

    function createGen0Robot(hashId) {
        userRobotGM.createGen0Robot(hashId, function() {                
            window.location.reload(true);
        });
    }

    function loadHtml(elementId, createGen0, enhance) {
        var createGen0Func = createGen0 + "('CreateGen0Hash')"; 
        var enhancePrefix = enhance + "('"; 
        var enhanceSuffix = "')";

        var symbol;
        var adr;
        var balance;
        var hashId;
        var robotNos = userRobotGM.getRobotNos();
    
        var titlle = "user owned robots: " 

        text  = '<div class="well">' + titlle + '</div>';
        text += '<div class="well">'
        text += '   <button type="button" onClick="' + createGen0Func + '">  Create Gen0 ZSC miner robot </button> <br>'
        text += '   <text id="CreateGen0Hash" value = "log:"> </text> <tr>';
        text += '</div>';

        text += '<div class="well">';
        text += '<table align="center" style="width:600px;min-height:30px">'
        text += '   <tr> <td>Robot ID</td> <td>Level</td> <td>Max SP</td> <td>Current SP</td> <td>Stake Start Time</td><td>Stake End Time</td> <td>Enhance Prob</td> <td>Enhance</td>  <td>Selling Price</td> <td>Set Price</td>  <td>Publish Selling </tr> '
        text += '   <tr> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>------</td> <td>---</td> <td>---</td> <td>---</td> <td>------</td> <td>------</td> </tr>'
        for (var i = 0; i < robotNos; ++i) {
            hashId  = symbol + "Hash";
            sentoId = symbol + "Dest";
            amountId= symbol + "Amount";
    
            text += '<tr>'
            text += '   <td><text>' + userRobotGM.getRobotId(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getRobotLev(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getMaxSP(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getCurSP(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getMineStart(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getMineEnd(i) + '</text></td>'
            text += '   <td><text>' + userRobotGM.getEnhanceProb(i) + '</text></td>'
            text += '   <td><button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + transSuffix + '">  Transfer  </button></td>'
            text += '   <td><text>' + userRobotGM.getPrceForSale(i) + '</text></td>'
            text += '   <td><button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + transSuffix + '">  Transfer  </button></td>'
            text += '   <td><button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + transSuffix + '">  Transfer  </button></td>'
            text += '<tr><br></tr>'
            text += '<tr> <td>------</td> <td>------</td> <td>---</td> <td>---</td> <td>---</td> </tr>'
        }
        text += '</table>'
        text += '</div>'
    
        document.getElementById(elementId).innerHTML = text;  
    }

</script>

</body>
</html>
