// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

contract Sku {

    mapping (string => AddSku) skuNo;
    mapping (string => AddSku) private skuMappingSkuGb;
    mapping (string => AddSku) private skuMappingSkuName;
    mapping (string => AddSku[]) private skuMappingCreated;

    struct AddSku {
        string skuGb;
        string skuName;
        string created;
        bool init;
    }

    AddSku[] public arr;
    
    function getAll() public view returns (AddSku[] memory) {
        return arr;
    }

    function AddData(string memory skuGb, string memory skuName, string memory created) public {
        AddSku memory _sku = AddSku(skuGb, skuName, created, true);
        skuMappingSkuGb[_sku.skuGb] = _sku;
        skuMappingSkuName[_sku.skuName] = _sku;
        skuMappingCreated[created].push(_sku);
        arr.push(_sku);
    }

    function getDataBySku(string memory skuGb) public view returns (AddSku memory)  {
        return skuMappingSkuGb[skuGb];
    }

    function getDataByName(string memory skuName) public view returns (AddSku memory)  {
        return skuMappingSkuName[skuName];
    }

    function getDataByDate(string memory created) public view returns (AddSku[] memory)  {
        return skuMappingCreated[created];
    }

} 