<?php 
/*
Copyright (c) 2018 ZSC Dev Team
*/
?>

<html>
<head>
<?php 
include("include.php");
$htmlObjects = new ZSCInclude("unknow");
echo $htmlObjects->loadScriptFiles(); 
?>

</head>
<body>
    <div class="col-lg-12">
        <br><i>Web-client for testing ZSC system on the Rinkeby</i><br><br>
        <div class="well" id="PageAlert"><?php echo $htmlObjects->loadAlert(); ?></div>
        <div class="well" id="PageBody"></div>
    </div>

<script type="text/javascript">
    loadIndexPageBody();
    
    function gotoLoin(type) {
        var href = "index_login.php?type=" + type;
        window.location.href = href;
    }

    function loadIndexPageBody() { 
        var funcPrefix = "gotoLoin('" 
        var funcSuffix = "')"

        var text = ''
        text += '<button type="button" onClick="' + funcPrefix + "provider" + funcSuffix + '">For provider </button> <br><br>'
        text += '<button type="button" onClick="' + funcPrefix + "receiver" + funcSuffix + '">For receiver </button> <br><br>'
        text += '<button type="button" onClick="' + funcPrefix + "staker" + funcSuffix + '">For staker user </button> <br><br>'
        document.getElementById("PageBody").innerHTML = text;
    }
</script>

</body>
</html>
