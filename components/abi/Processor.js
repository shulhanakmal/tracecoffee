const Processor = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "processorName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "farmJson",
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
        "name": "processorName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "farmJson",
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
            "name": "processorName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "farmJson",
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
        "internalType": "struct Processor.AddProcessor[]",
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
            "name": "processorName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "farmJson",
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
        "internalType": "struct Processor.AddProcessor[]",
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
        "name": "processorName",
        "type": "string"
      }
    ],
    "name": "getDataByName",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "processorName",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "farmJson",
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
        "internalType": "struct Processor.AddProcessor[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

module.exports = Processor;