 
function setupWeb3js(tag) {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 === 'undefined' && tag == true) {
            // Use Mist/MetaMask's provider
            web3 = new Web3(web3.currentProvider);
            return web3;
        } else {
            console.log('No web3? You should consider trying MetaMask!')
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            var Web3 = require('web3');
            var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
        
            if(!web3.isConnected())
                console.log("not connected");
            else
                console.log("connected");
            web3.eth.defaultAccount = web3.eth.coinbase;
            return web3;

        }
}


