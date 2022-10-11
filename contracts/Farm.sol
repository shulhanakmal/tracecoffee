// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma experimental ABIEncoderV2;

contract Farm {

    mapping (string => AddFarm) farm;
    mapping (string => AddFarm[]) private farmMappingfarmLoc;
    mapping (string => AddFarm[]) private farmMappingElevation;
    mapping (string => AddFarm[]) private farmMappingCreated;

    struct AddFarm {
        string farmLoc;
        string gmapsLink;
        string latitude;
        string longitude;
        string elevation;
        string created;
        bool init;
    }

    AddFarm[] public arr;
    
    function getAll() public view returns (AddFarm[] memory) {
        return arr;
    }
    function AddData(string memory farmLoc, string memory gmapsLink, string memory latitude, string memory longitude, string memory elevation, string memory created) public {
        AddFarm memory _farm = AddFarm(farmLoc, gmapsLink, latitude, longitude, elevation, created, true);
        farmMappingfarmLoc[farmLoc].push(_farm);
        farmMappingElevation[elevation].push(_farm);
        farmMappingCreated[created].push(_farm);
        arr.push(_farm);
    }

    function getDataByName(string memory farmLoc) public view returns (AddFarm[] memory)  {
        return farmMappingfarmLoc[farmLoc];
    }

    function getDataByElevation(string memory elevation) public view returns (AddFarm[] memory)  {
        return farmMappingElevation[elevation];
    }

    function getDataByDate(string memory created) public view returns (AddFarm[] memory)  {
        return farmMappingCreated[created];
    }

} 