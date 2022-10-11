// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

contract Processor {

    mapping (string => AddProcessor) processor;
    mapping (string => AddProcessor[]) private processorMappingProcessorName;
    mapping (string => AddProcessor[]) private processorMappingCreated;

    struct AddProcessor {
        string processorName;
        string farmJson;
        string created;
        bool init;
    }

    AddProcessor[] public arr;
    
    function getAll() public view returns (AddProcessor[] memory) {
        return arr;
    }
    function AddData(string memory processorName, string memory farmJson, string memory created) public {
        AddProcessor memory _processor = AddProcessor(processorName, farmJson, created, true);
        processorMappingProcessorName[processorName].push(_processor);
        processorMappingCreated[created].push(_processor);
        arr.push(_processor);
    }

    function getDataByName(string memory processorName) public view returns (AddProcessor[] memory)  {
        return processorMappingProcessorName[processorName];
    }

    function getDataByDate(string memory created) public view returns (AddProcessor[] memory)  {
        return processorMappingCreated[created];
    }

} 