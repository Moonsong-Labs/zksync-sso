import { Wallet } from "ethers";
import { Provider, types } from "zksync-ethers";
import { config } from "./config";
import { Contract } from "ethers";
import type { Key } from "./types";
import { keccak256, toBytes } from "viem";

const abi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MAX_KEYS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "OIDCKeys",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "kid",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "n",
        "type": "bytes",
        "internalType": "bytes"
      },
      {
        "name": "e",
        "type": "bytes",
        "internalType": "bytes"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getKey",
    "inputs": [
      {
        "name": "issHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "kid",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct OidcKeyRegistry.Key",
        "components": [
          {
            "name": "kid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "n",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "e",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hashIssuer",
    "inputs": [
      {
        "name": "iss",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "initialize",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "keyIndexes",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setKey",
    "inputs": [
      {
        "name": "issHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "key",
        "type": "tuple",
        "internalType": "struct OidcKeyRegistry.Key",
        "components": [
          {
            "name": "kid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "n",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "e",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setKeys",
    "inputs": [
      {
        "name": "issHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "keys",
        "type": "tuple[]",
        "internalType": "struct OidcKeyRegistry.Key[]",
        "components": [
          {
            "name": "kid",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "n",
            "type": "bytes",
            "internalType": "bytes"
          },
          {
            "name": "e",
            "type": "bytes",
            "internalType": "bytes"
          }
        ]
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Initialized",
    "inputs": [
      {
        "name": "version",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  }
]

export class ContractUpdater {
  private wallet: Wallet;
  private provider: Provider;
  private contract: Contract;
  private issHashes = new Map<string, string>();

  constructor() {
    if (config.RPC_URL) {
      this.provider = new Provider(config.RPC_URL);
    } else if (config.NETWORK) {
      this.provider = Provider.getDefaultProvider(this.getNetwork());
    } else {
      throw new Error("Either RPC_URL or NETWORK must be set");
    }
    this.wallet = new Wallet(config.ZKSYNC_PRIVATE_KEY, this.provider);

    this.contract = new Contract(
      config.CONTRACT_ADDRESS,
      abi,
      this.wallet
    )
  }

  public async updateContract(iss: string, keys: Key[]): Promise<void> {
    console.log("Updating contract...");

    const issHash = this.getIssHash(iss);
    let finalKeys = [];
    for (const key of keys) {
      const tx = await this.contract.getKey(issHash, key.kid);
      console.log(tx);
      if (tx.kid === key.kid) {
        console.log("Key already exists, skipping:", key.kid);
      } else {
        finalKeys.push(key);
      }
    }

    if (finalKeys.length === 0) {
      console.log("No new keys to add");
      return;
    }

    const tx = await this.contract.setKeys(issHash, finalKeys);
    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");
  }

  private getNetwork(): types.Network {
    if (!config.NETWORK) {
      throw new Error("NETWORK is not set in config");
    }

    const networkMap: Record<string, types.Network> = {
      mainnet: types.Network.Mainnet,
      sepolia: types.Network.Sepolia,
      localhost: types.Network.Localhost,
    };

    const network = networkMap[config.NETWORK.toLowerCase()];

    if (!network) {
      throw new Error(`Unknown or unsupported network: ${config.NETWORK}`);
    }

    return network;
  }

  private getIssHash(iss: string): string {
    let issHash = this.issHashes.get(iss);
    if (!issHash) {
      console.log("Hashing issuer:", iss);
      issHash = keccak256(toBytes(iss));
      console.log("Hash:", issHash);
      this.issHashes.set(iss, issHash);
    }
    return issHash;
  }
}
