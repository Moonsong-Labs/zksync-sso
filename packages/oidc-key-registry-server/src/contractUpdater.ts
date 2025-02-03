import { Wallet } from "ethers";
import { Provider, types } from "zksync-ethers";
import { config } from "./config";


export class ContractUpdater {
  private wallet: Wallet;
  private provider: Provider;

  constructor() {
    if (config.RPC_URL) {
      this.provider = new Provider(config.RPC_URL);
    } else if (config.NETWORK) {
      this.provider = Provider.getDefaultProvider(this.getNetwork());
    } else {
      throw new Error("Either RPC_URL or NETWORK must be set");
    }
    this.wallet = new Wallet(config.ZKSYNC_PRIVATE_KEY, this.provider);
  }

  public async updateContract() {
    console.log("Updating contract...");
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
}
