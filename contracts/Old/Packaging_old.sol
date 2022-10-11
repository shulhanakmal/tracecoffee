// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

contract PackagingOld {

    mapping (string => AddPackaging) package;
    mapping (string => AddPackaging) private packageMappingBatchNumber;
    mapping (string => AddPackaging[]) private packageMappingDate;
    mapping (string => AddPackaging[]) private packageMappingVolume;

    struct AddPackaging {
        string batchNumber;
        string dateReceived;
        string volume;
        string ipfsProcessPhoto;
        string ipfsCertificate;
        string created;
        bool init;
    }

    AddPackaging[] public arr;
    
    function getAll() public view returns (AddPackaging[] memory) {
        return arr;
    }
    function AddData(string memory batchNumber, string memory dateReceived, string memory volume, string memory ipfsProcessPhoto, string memory ipfsCertificate, string memory created) public {
        AddPackaging memory _package = AddPackaging(batchNumber, dateReceived, volume, ipfsProcessPhoto, ipfsCertificate, created, true);
        packageMappingBatchNumber[_package.batchNumber] = _package;
        packageMappingDate[dateReceived].push(_package);
        packageMappingVolume[volume].push(_package);
        arr.push(_package);
    }
    function getDataByBatch(string memory batchNumber) public view returns (AddPackaging memory)  {
        return (packageMappingBatchNumber[batchNumber]);
    }

    function getDataByDate(string memory dateReceived) public view returns (AddPackaging[] memory)  {
        return packageMappingDate[dateReceived];
    }

    function getDataByvolume(string memory volume) public view returns (AddPackaging[] memory)  {
        return packageMappingVolume[volume];
    }

} 