

<?php include("adm_header.php"); ?>

<html>
<head>
<?php echo includeScriptFiles(); ?>
<script type="text/javascript">
    var web3 = setupWeb3js(false);
   
</script>
</head>
<body>

<?php echo includeHeader();?>

<div class="page-header"><font size="5" color="blue" >Setup ZSC system in the testing envrioment</font></div>

<?php echo includAllAdrs();?>

<div class="well">
        <text>Username</text>  <input type="text" id="AddUserUser" value="test"></input> <br>
        <text>Password</text>  <input type="Password" id="AddUserPass" value="aaa"></input> <br>
        <button id="AddUser" type="button" onClick="addUser('AddUserUser', 'AddUserPass', 'AddUserHash')">Add a user</button> <br>
        <text id="AddUserHash"></text>
</div>

</body>
</html>

