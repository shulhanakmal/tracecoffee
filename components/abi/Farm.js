const Farm = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "farmLoc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "gmapsLink",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "latitude",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "longitude",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "elevation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "created",
        "type": "string"
      }
    ],
    "name": "AddData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "arr",
    "outputs": [
      {
        "internalType": "string",
        "name": "farmLoc",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "gmapsLink",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "latitude",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "longitude",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "elevation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "created",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "init",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAll",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "farmLoc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "gmapsLink",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "elevation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "created",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "init",
            "type": "bool"
          }
        ],
        "internalType": "struct Farm.AddFarm[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "created",
        "type": "string"
      }
    ],
    "name": "getDataByDate",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "farmLoc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "gmapsLink",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "elevation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "created",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "init",
            "type": "bool"
          }
        ],
        "internalType": "struct Farm.AddFarm[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "elevation",
        "type": "string"
      }
    ],
    "name": "getDataByElevation",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "farmLoc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "gmapsLink",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "elevation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "created",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "init",
            "type": "bool"
          }
        ],
        "internalType": "struct Farm.AddFarm[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "farmLoc",
        "type": "string"
      }
    ],
    "name": "getDataByName",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "farmLoc",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "gmapsLink",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "latitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "longitude",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "elevation",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "created",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "init",
            "type": "bool"
          }
        ],
        "internalType": "struct Farm.AddFarm[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

module.exports = Farm;