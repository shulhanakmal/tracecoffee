const Sku = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "skuGb",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "skuName",
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
          "name": "skuGb",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "skuName",
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
              "name": "skuGb",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "skuName",
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
          "internalType": "struct Sku.AddSku[]",
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
              "name": "skuGb",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "skuName",
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
          "internalType": "struct Sku.AddSku[]",
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
          "name": "skuName",
          "type": "string"
        }
      ],
      "name": "getDataByName",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "skuGb",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "skuName",
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
          "internalType": "struct Sku.AddSku",
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
          "name": "skuGb",
          "type": "string"
        }
      ],
      "name": "getDataBySku",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "skuGb",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "skuName",
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
          "internalType": "struct Sku.AddSku",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
]

module.exports = Sku;