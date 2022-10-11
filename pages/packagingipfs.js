import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import Web3 from "web3";
import { AddPackaging } from "./abi/Packaging";
import { create } from "ipfs-http-client";

function Packaging() {

    const [batchNumber, setbatchNumber] = useState('');
    const [dateReceived, setdateReceived] = useState('');
    const [volume, setvolume] = useState('');
    const [ipfsProcessPhoto, setipfsProcessPhoto] = useState('');
    const [ipfsCertificate, setipfsCertificate] = useState('');
    const [urlProcessingPhoto, setUrlProcessPhoto] = useState(null);
    const [urlCertificate, setUrlCertificate] = useState(null);
    const [dataByBatch, setDataByBatch] = useState(null);
    const [dataByDate, setDataByDate] = useState(null);
    const [dataByVolume, setDataByVolume] = useState(null);
    const [allData, setAllData] = useState(null);

    const client = create('https://ipfs.infura.io:5001/api/v0')

    async function submit(e) {

        console.log('cek ipfsProcessPhoto', ipfsProcessPhoto);
        console.log('cek ipfsCertificate', ipfsCertificate);

        let error = null;

        const projectId = '2DZjhW3JVMffToVaXUYC4PJ1Lf4';   // <---------- your Infura Project ID (mestinya ditaro di .ENV)
        const projectSecret = '5aad2702f0db74956ae0c1ecc41c8761';  // <---------- your Infura Secret (for security concerns, consider saving these values in .env files (mestinya ditaro di .ENV))

        // start upload processPhoto to ipfs
        try {
            const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
            const ipfs = create(
                {
                    host: 'ipfs.infura.io',
                    port: 5001,
                    protocol: 'https',
                    headers: {
                        authorization: auth,
                    },
                }
            );

            const added = await ipfs.add({ path: ipfsProcessPhoto.name, content: ipfsProcessPhoto });
            let docCid = `${added.cid}`;
            const docUrl = `https://msa-file.infura-ipfs.io/ipfs/${added.cid}`

            console.log('url', docUrl);
            setUrlProcessPhoto(docUrl);

        } catch (e) {
            error = `Processing Photo Failed Upload to ipfs ${e.message}`;
        }
        // end upload processPhoto to ipfs
        // =================================================================================================================================

        // start upload certificate to ipfs
        try {

            const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
            const ipfs = create(
                {
                    host: 'ipfs.infura.io',
                    port: 5001,
                    protocol: 'https',
                    headers: {
                        authorization: auth,
                    },
                }
            );

            const added = await ipfs.add({ path: ipfsCertificate.name, content: ipfsCertificate });
            let docCid = `${added.cid}`;
            const docUrl = `https://msa-file.infura-ipfs.io/ipfs/${added.cid}` 
            // project di infura dedicated gateways harus di enabled dan menggunakan unique subdomain name karena 'infura-ipfs.io' url untuk baca file tidak terbaca karena diblokir kominfo

            console.log('url', docUrl);
            setUrlCertificate(docUrl);

        } catch (e) {
            error = `Certificate Failed Upload to ipfs ${e.message}`;
        }
        //end upload certificate to ipfs
        // =================================================================================================================================

        if(error) { // jika terjadi error ketika upload file ke ipfs

            alert(error);

        } else {
            
            // start post to blockchain
            try{
                const web3Modal = new Web3Modal();
                const connection = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(connection);
                const signer = provider.getSigner()

                let contract = new ethers.Contract('0xb7AFEE5518CAD6ae38fc30Ff9A3D271Facc788C1', AddPackaging, signer)
                let transaction = await contract.AddData(batchNumber, dateReceived, volume, urlProcessingPhoto, urlCertificate, 'tanggal')

                await transaction.wait();

                await alert(`Data has been added and transaction hash is ${transaction.hash}`);


            } catch(e) {
                alert(`Failed, Transaction rejected : ${e.message}`);
            }
            // end post to blockchain
            // =================================================================================================================================

        }

    }

    async function getAll() {

        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner()

            let contract = new ethers.Contract('0xb7AFEE5518CAD6ae38fc30Ff9A3D271Facc788C1', AddPackaging, signer)
            let transaction = await contract.getAll();

            setAllData(transaction)

            console.log(transaction);

          } catch(e) {
            alert(`Failed, Transaction rejected : ${e.message}`);
          }

    }

    async function getByBatch() {

        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner()

            let contract = new ethers.Contract('0xb7AFEE5518CAD6ae38fc30Ff9A3D271Facc788C1', AddPackaging, signer)
            let transaction = await contract.getDataByBatch(batchNumber);

            setDataByBatch(transaction)

          } catch(e) {
            alert(`Failed, Transaction rejected : ${e.message}`);
          }

    }

    async function getDataByDate() {

        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner()

            let contract = new ethers.Contract('0xb7AFEE5518CAD6ae38fc30Ff9A3D271Facc788C1', AddPackaging, signer)
            let transaction = await contract.getDataByDate(dateReceived);

            setDataByDate(transaction)

          } catch(e) {
            alert(`Failed, Transaction rejected : ${e.message}`);
          }

    }
    
    async function getDataByVolume() {

        try{
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner()

            let contract = new ethers.Contract('0xb7AFEE5518CAD6ae38fc30Ff9A3D271Facc788C1', AddPackaging, signer)
            let transaction = await contract.getDataByvolume(volume);

            setDataByVolume(transaction)

          } catch(e) {
            alert(`Failed, Transaction rejected : ${e.message}`);
          }

    }

    return (
        <div>
            <hr></hr>
            <br></br>
            <input name="batchNumber" id="batchNumber" placeholder="Input batchNumber" onChange={(e) => setbatchNumber(e.target.value)} /> <br></br>
            <input name="dateReceived" id="dateReceived" placeholder="Input dateReceived" onChange={(e) => setdateReceived(e.target.value)} /> <br></br>
            <input name="volume" id="volume" placeholder="Input volume" onChange={(e) => setvolume(e.target.value)} /> <br></br>
            <input name="ipfsProcessPhoto" id="ipfsProcessPhoto" type="file" placeholder="Upload File ProcessPhoto" onChange={(e) => setipfsProcessPhoto(e.target.files[0])} /> <br></br>
            <input name="ipfsCertificate" id="ipfsCertificate" type="file" placeholder="Upload File Certificate" onChange={(e) => setipfsCertificate(e.target.files[0])} />
            <br></br>
            <button onClick={() => submit()} type="button">Add</button>
            <hr></hr>

            <br></br>
            <input name="batchNumber" id="batchNumber" placeholder="Get Data by Batch Number" onChange={(e) => setbatchNumber(e.target.value)} /> <br></br>
            <br></br>
            <button onClick={() => getByBatch()} type="button">Get By Batch</button> 
            <hr></hr>
            <label>{dataByBatch}</label>
            <br></br>

            <br></br>
            <input name="dateReceived" id="dateReceived" placeholder="Get Data by date received" onChange={(e) => setdateReceived(e.target.value)} /> <br></br>
            <br></br>
            <button onClick={() => getDataByDate()} type="button">Get By Date Received</button>
            <hr></hr>
            <label>{dataByDate}</label>
            <br></br>

            <br></br>
            <input name="volume" id="volume" placeholder="Input volume" onChange={(e) => setvolume(e.target.value)} /> <br></br>
            <br></br>
            <button onClick={() => getDataByVolume()} type="button">Get By Volume</button>
            <hr></hr>
            <label>{dataByVolume}</label>
            <br></br>

            <br></br>
            <label>{allData}</label>
            <br></br>
            <button onClick={() => getAll()} type="button">Get All</button>
            <hr></hr>
            <br></br>

        </div>
        

    );
}

export default Packaging;