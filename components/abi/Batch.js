export const Batch = [
  {
    inputs: [
      {
        internalType: "string",
        name: "po",
        type: "string",
      },
      {
        internalType: "string",
        name: "sku",
        type: "string",
      },
      {
        internalType: "string",
        name: "harvesting",
        type: "string",
      },
      {
        internalType: "string",
        name: "batchNo",
        type: "string",
      },
      {
        internalType: "string",
        name: "species",
        type: "string",
      },
      {
        internalType: "string",
        name: "variety",
        type: "string",
      },
      {
        internalType: "string",
        name: "process",
        type: "string",
      },
      {
        internalType: "string",
        name: "created",
        type: "string",
      },
    ],
    name: "AddData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "arr",
    outputs: [
      {
        internalType: "string",
        name: "po",
        type: "string",
      },
      {
        internalType: "string",
        name: "sku",
        type: "string",
      },
      {
        internalType: "string",
        name: "harvesting",
        type: "string",
      },
      {
        internalType: "string",
        name: "batchNo",
        type: "string",
      },
      {
        internalType: "string",
        name: "species",
        type: "string",
      },
      {
        internalType: "string",
        name: "variety",
        type: "string",
      },
      {
        internalType: "string",
        name: "process",
        type: "string",
      },
      {
        internalType: "string",
        name: "created",
        type: "string",
      },
      {
        internalType: "bool",
        name: "init",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAll",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "po",
            type: "string",
          },
          {
            internalType: "string",
            name: "sku",
            type: "string",
          },
          {
            internalType: "string",
            name: "harvesting",
            type: "string",
          },
          {
            internalType: "string",
            name: "batchNo",
            type: "string",
          },
          {
            internalType: "string",
            name: "species",
            type: "string",
          },
          {
            internalType: "string",
            name: "variety",
            type: "string",
          },
          {
            internalType: "string",
            name: "process",
            type: "string",
          },
          {
            internalType: "string",
            name: "created",
            type: "string",
          },
          {
            internalType: "bool",
            name: "init",
            type: "bool",
          },
        ],
        internalType: "struct Batch.AddBatch[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
