const path = require("path");
const Web3 = require("web3");
const Packaging = require("../abi/Packaging");
const Processor = require("../abi/Processor");
const Farm = require("../abi/Farm");
const Sku = require("../abi/Sku");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { error, count } = require("console");
const axios = require('axios').default;

const dotenv = require('dotenv');
dotenv.config();

// get rpc blockchain network
const p = new Web3.providers.HttpProvider(
    'https://rpc-mumbai.maticvigil.com/'
);

// get private key wallet
const privateKeys = [
    process.env.NEXT_PUBLIC_PRIVATE_WALLET
];

// set provider
const provider = new HDWalletProvider({
    privateKeys: privateKeys,
    providerOrUrl: p,
});
const web3 = new Web3(provider);

provider.engine.stop();

class POSTBC {

    async postData() {

        var processContract = null;
        var waiting = null;
        var post = null;

        // get address wallet
        var account = process.env.NEXT_PUBLIC_PUBLIC_WALLET;

        // set current date
        let currentDate = new Date();
        let cDay = currentDate.getDate();
        let cMonth = currentDate.getMonth() + 1;
        let cYear = currentDate.getFullYear();
        var date = +cDay + "/" + cMonth + "/" + cYear;

        var Web3 = require("web3");

        // get data queue
        await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/get-data-waiting`)
        .then(function (res) {

            waiting = res.data.data;

        });

        if(waiting) { // jika ada data antrian yang belum dipost ke blockchain
            return await processPost(waiting);
        } else {
            console.log("Tidak ada antrian data");
        }

        // process post data ke blockchain
        async function processPost(data) {
            if(data){
                await data.forEach(async function (d, index) {
                
                    // start post to blockchain
                    try{

                        if(d.flag == 'Processor'){

                            // get data processor dari db untuk dipost ke blockchain
                            await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/outside-get-data-processor/${d.flag_id}`)
                            .then(async function (res) {
                                console.log('cek processor', res.data.data);

                                // get smartcontract
                                processContract = new web3.eth.Contract(
                                    Processor,
                                    process.env.NEXT_PUBLIC_ADDRESS_PROCESSOR
                                );
                                
                                // proses post data ke blockchain
                                post = await processContract.methods
                                .AddData(res.data.data.processor_name, res.data.data.ipfs_detail, date)
                                .send({
                                    from: account
                                });

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

                                    await axios({
                                        method: 'post',
                                        url: `${process.env.NEXT_PUBLIC_URL_API}/updateLogBlockchain/${d.id}`,
                                        data: {
                                            transaction_hash: tx_hash,
                                            block_no: block,
                                            block_hash: blockHash,
                                            wallet_signer: wallet,
                                            to_address: sc_address,
                                            status: 'Success',
                                            status_remark: 'Success post to blockchain'
                                        },
                                        headers: {
                                            "Content-Type": `application/json`,
                                            "Accept": `application/json`
                                        }
                                    }).then(function (response) {
                                        console.log('cek response post data', response);
                                    });

                                }
                                // end transaction log
                        
                            });

                        } else if(d.flag == 'Farm') {
                            
                            // get data farm dari db untuk dipost ke blockchain
                            await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/outside-get-data-farm/${d.flag_id}`)
                            .then(async function (res) {

                                // get smartcontract
                                processContract = new web3.eth.Contract(
                                    Farm,
                                    process.env.NEXT_PUBLIC_ADDRESS_FARM
                                );
    
                                // proses post data ke blockchain
                                post = await processContract.methods
                                .AddData(res.data.data.farm_location, res.data.data.link_maps, res.data.data.latitude, res.data.data.longitude, res.data.data.elevation, date)
                                .send({
                                    from: account
                                });

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

                                    await axios({
                                        method: 'post',
                                        url: `${process.env.NEXT_PUBLIC_URL_API}/updateLogBlockchain/${d.id}`,
                                        data: {
                                            transaction_hash: tx_hash,
                                            block_no: block,
                                            block_hash: blockHash,
                                            wallet_signer: wallet,
                                            to_address: sc_address,
                                            status: 'Success',
                                            status_remark: 'Success post to blockchain'
                                        },
                                        headers: {
                                            "Content-Type": `application/json`,
                                            "Accept": `application/json`
                                        }
                                    }).then(function (response) {
                                        console.log('cek response post data', response);
                                    });

                                }
                                // end transaction log
                        
                            });
                        // end transaction
                            
                        } else if(d.flag == 'Packaging') {

                            // get data farm dari db untuk dipost ke blockchain
                            await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/outside-get-data-packaging/${d.flag_id}`)
                            .then(async function (res) {

                                // get smartcontract
                                processContract = new web3.eth.Contract(
                                    Packaging,
                                    process.env.NEXT_PUBLIC_ADDRESS_PACKAGING
                                );
    
                                // proses post data ke blockchain
                                post = await processContract.methods
                                .AddData(res.data.data.get_sku.sku, res.data.data.volume, res.data.data.ipfs_detail, date)
                                .send({
                                    from: account
                                });

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

                                    await axios({
                                        method: 'post',
                                        url: `${process.env.NEXT_PUBLIC_URL_API}/updateLogBlockchain/${d.id}`,
                                        data: {
                                            transaction_hash: tx_hash,
                                            block_no: block,
                                            block_hash: blockHash,
                                            wallet_signer: wallet,
                                            to_address: sc_address,
                                            status: 'Success',
                                            status_remark: 'Success post to blockchain'
                                        },
                                        headers: {
                                            "Content-Type": `application/json`,
                                            "Accept": `application/json`
                                        }
                                    }).then(function (response) {
                                        console.log('cek response post data', response);
                                    });

                                }
                                // end transaction log
                        
                            });

                        } else if(d.flag == 'Sku') {

                            // get data farm dari db untuk dipost ke blockchain
                            await axios.get(`${process.env.NEXT_PUBLIC_URL_API}/outside-get-data-sku/${d.flag_id}`)
                            .then(async function (res) {

                                // get smartcontract
                                processContract = new web3.eth.Contract(
                                    Sku,
                                    process.env.NEXT_PUBLIC_ADDRESS_SKU
                                );
    
                                // proses post data ke blockchain
                                post = await processContract.methods
                                .AddData(res.data.data.sku, res.data.data.sku_name, date)
                                .send({
                                    from: account
                                });

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

                                    await axios({
                                        method: 'post',
                                        url: `${process.env.NEXT_PUBLIC_URL_API}/updateLogBlockchain/${d.id}`,
                                        data: {
                                            transaction_hash: tx_hash,
                                            block_no: block,
                                            block_hash: blockHash,
                                            wallet_signer: wallet,
                                            to_address: sc_address,
                                            status: 'Success',
                                            status_remark: 'Success post to blockchain'
                                        },
                                        headers: {
                                            "Content-Type": `application/json`,
                                            "Accept": `application/json`
                                        }
                                    }).then(function (response) {
                                        console.log('cek response post data', response);
                                    });

                                }
                                // end transaction log
                        
                            });
                            
                        }
                        // end transaction
    
                    } catch(e) {
    
                        console.log('error', e.message);

                        // insert transaction log to database
                        // let postData = {
                        //     status: 'Failed',
                        //     status_remark: e.message
                        // };
    
                        // await axios.post(`${process.env.NEXT_PUBLIC_URL_API}/updateLogBlockchain/${d.id}`, {postData})
                        // .then(function (res) {
                        //     console.log(`Error ${d.flag_desc} : ${e.message}`);
                        // }).catch(function (error) {
                        //     console.log('error log failed', error);
                        // });
                        // end transaction log
                    }
            
                });
            } else {
                console.log('tidak ada antrian data');
            }
        }

    }
  
}

module.exports = POSTBC;