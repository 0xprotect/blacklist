require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require('hardhat-abi-exporter');
require('hardhat-log-remover');
require("hardhat-gas-reporter");

const RPC_URL = process.env.VUE_APP_RPC_URL || "http://localhost:8545"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY
const UPDATER_ADDRESS = process.env.UPDATER_ADDRESS
const UPDATER_PRIVATE_KEY = process.env.UPDATER_PRIVATE_KEY
const REPORT_GAS = process.env.REPORT_GAS
const CMC_API_KEY = process.env.CMC_API_KEY

// Default Hardhat network config
let hardhatConfig = {
  live: false,
  saveDeployments: true,
  tags: ["test"]
}

// Local network config
let localhostConfig = {
  url: RPC_URL,
  live: false,
  saveDeployments: true,
  tags: ["local"]
}

// Goerli testnet config
let goerliConfig = {
  url: RPC_URL,
  chainId: 5,
  live: true,
  saveDeployments: true,
  tags: ["staging"],
}

// Mainnet config
let mainnetConfig = {
  url: RPC_URL,
  chainId: 1,
  live: true,
  saveDeployments: true,
  tags: ["prod", "mainnet", "live"]
}

if (DEPLOYER_PRIVATE_KEY && DEPLOYER_PRIVATE_KEY.length > 0) {
  goerliConfig.accounts = [DEPLOYER_PRIVATE_KEY]
  mainnetConfig.accounts = [DEPLOYER_PRIVATE_KEY]
  if (ADMIN_PRIVATE_KEY && ADMIN_PRIVATE_KEY.length > 0) {
    goerliConfig.accounts.push(ADMIN_PRIVATE_KEY)
    mainnetConfig.accounts.push(ADMIN_PRIVATE_KEY)
    if (UPDATER_PRIVATE_KEY && UPDATER_PRIVATE_KEY.length > 0) {
      goerliConfig.accounts.push(UPDATER_PRIVATE_KEY)
      mainnetConfig.accounts.push(UPDATER_PRIVATE_KEY)
    }
  }
}


// Hardhat tasks
// Documentation: https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Hardhat Config
// Documentation: https://hardhat.org/config/
// Deploy add-ons: https://hardhat.org/plugins/hardhat-deploy.html
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: hardhatConfig,
    localhost: localhostConfig,
    goerli: goerliConfig,
    mainnet: mainnetConfig
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: DEPLOYER_ADDRESS,
      5: DEPLOYER_ADDRESS
    },
    admin: {
      default: 0,
      1: ADMIN_ADDRESS,
      5: ADMIN_ADDRESS
    },
    updater: {
      default: 0,
      1: UPDATER_ADDRESS,
      5: UPDATER_ADDRESS
    }
  },
  paths: {
    deploy: 'deploy',
    deployments: 'deployments',
    imports: `imports`
  },
  abiExporter: {
    path: './abis',
    clear: true,
    flat: true
  },
  gasReporter: {
    enabled: REPORT_GAS && REPORT_GAS == "true" ? true : false,
    coinmarketcap: CMC_API_KEY,
    currency: 'USD',
    showTimeSpent: true
  }
};