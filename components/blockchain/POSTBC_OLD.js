const path = require("path");
const Web3 = require("web3");
const Processor = require("../abi/Processor");
const Farm = require("../abi/Farm");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { error, count } = require("console");
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();


const p = new Web3.providers.HttpProvider(
    'https://rpc-mumbai.maticvigil.com/'
);
const privateKeys = [
    process.env.NEXT_PUBLIC_PRIVATE_WALLET
];

const provider = new HDWalletProvider({
    privateKeys: privateKeys,
    providerOrUrl: p,
});
const web3 = new Web3(provider);

provider.engine.stop();

class POSTBC {

    async postData() {
        // let users = JSON.parse(localStorage.getItem("users"));

        // set current date
        let currentDate = new Date();
        let cDay = currentDate.getDate();
        let cMonth = currentDate.getMonth() + 1;
        let cYear = currentDate.getFullYear();
        var date = +cDay + "/" + cMonth + "/" + cYear;

        // const token = users.token;
        const account = null;
        const Web3 = require("web3");

        // get wallet
        const getWallet = async () => {

            web3.eth.getAccounts(function (err, accounts) {
            if (err != null) {
                console.log("An error occurred: " + err);
            } else if (accounts.length === 0) {
                console.log("User is not logged in to MetaMask");
            } else {
                // setAccount(accounts[0]);
                accounts = accounts[0];
            }
            });
        };

        // process data queue
        await axios({
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_URL_API}/get-data-waiting`,
            // headers: {
            //     "Content-Type": `application/json`,
            //     Accept: `application/json`,
            //     Authorization: `Bearer ${token}`,
            // },
        }).then(
            async (res) => {
            await res.data.data.forEach(async function (d, index) {
                
                // start post to blockchain
                try{
                    // get contract
                    const processContract = null;
                    if(d.flag == 'Processor'){
                        processContract = new web3.eth.Contract(
                            Processor,
                            process.env.NEXT_PUBLIC_ADDRESS_PROCESSOR
                        );
                    } else if(d.flag == 'Farm') {
                        processContract = new web3.eth.Contract(
                            Farm,
                            process.env.NEXT_PUBLIC_ADDRESS_FARM
                        );
                    }

                    if(processContract) {

                        // transaction to blockchain
                        if(d.flag == 'Processor') {
                            var post = await processContract.methods
                            .AddData(d.processor_name, d.ipfs_detail, date)
                            .send({
                                from: account,
                                // gas,
                                }
                            );
                            console.log('cek post',post);
                        } else if(d.flag == 'Farm') {
                            var post = await processContract.methods
                            .AddData(d.farm_location, d.link_maps, d.latitude, d.longitude, d.elevation, date)
                            .send({
                                from: account,
                                // gas,
                                }
                            );
                        }
                        // end transaction 
                    }

                    // insert transaction log to database
                    if(post) {
                        // get address wallet signer
                        let wallet = post.from;
                        // get smartcontract address (to)
                        let sc_address = post.to;
                        // get transaction hash
                        let tx_hash = post.transactionHash;
                        // get block number
                        let block = post.blockNumber;
                        // get block hash
                        let blockHash = post.blockHash;

                        let postData = {
                            transaction_hash: tx_hash,
                            block_no: block,
                            block_hash: blockHash,
                            wallet_signer: wallet,
                            to_address: sc_address,
                            status: 'Success',
                            status_remark: 'Success post to blockchain'
                        };

                        await axios({
                            method: 'POST',
                            url: `${process.env.NEXT_PUBLIC_URL_API}/updateLogBlockchain/${d.id}`,
                            data: postData,
                            // headers: {
                            //     "Content-Type": `application/json`,
                            //     "Accept": `application/json`,
                            //     "Authorization": `Bearer ${token}`
                            // }
                        });
                        console.log(`success update ${d.flag_desc}`);
                    }
                    // end transaction log

                } catch(e) {

                    console.log(e.message);
                    // insert transaction log to database
                    let postData = {
                        status: 'Failed',
                        status_remark: e.message
                    };

                    await axios({
                        method: 'POST',
                        url: `${process.env.NEXT_PUBLIC_URL_API}/updateLogBlockchain/${d.id}`,
                        data: postData,
                        // headers: {
                        //     "Content-Type": `application/json`,
                        //     "Accept": `application/json`,
                        //     "Authorization": `Bearer ${token}`
                        // }
                    });
                    // end transaction log
                }

            });
    
            },
            (err) => {
            console.log("AXIOS ERROR: ", err.message);
            }
        );

    }
  
}

module.exports = POSTBC;