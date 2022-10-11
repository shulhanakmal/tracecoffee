// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

contract Packaging {

    mapping (string => AddPackaging) package;
    mapping (string => AddPackaging) private packageMappingSku;
    mapping (string => AddPackaging[]) private packageMappingVolume;
    mapping (string => AddPackaging[]) private packageMappingCreate;

    struct AddPackaging {
        string sku;
        string volume;
        string batchJson;
        string created;
        bool init;
    }

    AddPackaging[] public arr;
    
    function getAll() public view returns (AddPackaging[] memory) {
        return arr;
    }
    function AddData(string memory sku, string memory volume, string memory batchJson, string memory created) public {
        AddPackaging memory _package = AddPackaging(sku, volume, batchJson, created, true);
        packageMappingSku[_package.sku] = _package;
        packageMappingVolume[_package.volume].push(_package);
        packageMappingCreate[volume].push(_package);
        arr.push(_package);
    }
    function getDataBySku(string memory sku) public view returns (AddPackaging memory)  {
        return (packageMappingSku[sku]);
    }

    function getDataByDate(string memory created) public view returns (AddPackaging[] memory)  {
        return packageMappingCreate[created];
    }

    function getDataByvolume(string memory volume) public view returns (AddPackaging[] memory)  {
        return packageMappingVolume[volume];
    }

} 