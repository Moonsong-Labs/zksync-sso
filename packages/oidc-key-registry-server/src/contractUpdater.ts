import { Wallet } from "ethers";
import { Provider, types } from "zksync-ethers";
import { config } from "./config";


export class ContractUpdater {
  private wallet: Wallet;

  constructor() {
    const provider = Provider.getDefaultProvider(types.Network.Sepolia);
    this.wallet = new Wallet(config.ZKSYNC_PRIVATE_KEY, provider);
  }

  public async updateContract() {
    console.log("Updating contract...");
  }
}