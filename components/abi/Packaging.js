const Packaging = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "sku",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "volume",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "batchJson",
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
        "name": "sku",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "volume",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "batchJson",
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
            "name": "sku",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "volume",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "batchJson",
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
        "internalType": "struct Packaging.AddPackaging[]",
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
            "name": "sku",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "volume",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "batchJson",
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
        "internalType": "struct Packaging.AddPackaging[]",
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
        "name": "sku",
        "type": "string"
      }
    ],
    "name": "getDataBySku",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "sku",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "volume",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "batchJson",
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
        "internalType": "struct Packaging.AddPackaging",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "volume",
        "type": "string"
      }
    ],
    "name": "getDataByvolume",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "sku",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "volume",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "batchJson",
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
        "internalType": "struct Packaging.AddPackaging[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

module.exports = Packaging;