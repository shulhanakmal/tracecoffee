// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

contract Batch {

    mapping (string => AddBatch) batch;
    mapping (string => AddBatch) private batchMappingKodeBatch;

    struct AddBatch {
        string po;
        string sku;
        string harvesting;
        string batchNo;
        string species;
        string variety;
        string process;
        string created;
        bool init;
    }

    AddBatch[] public arr;
    
    function getAll() public view returns (AddBatch[] memory) {
        return arr;
    }
    function AddData(string memory po, string memory sku, string memory harvesting, string memory batchNo, string memory species, string memory variety, string memory process, string memory created) public {
        AddBatch memory _batch = AddBatch(po, sku, harvesting, batchNo, species, variety, process, created, true);
        arr.push(_batch);
    }

} 