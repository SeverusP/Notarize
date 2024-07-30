require('dotenv').config();
const { MNEMONIC, PROJECT_ID, CMC_API_KEY } = process.env;

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: [
    'solidity-coverage'
  ],

  networks: {
    coverage: {
      host: '127.0.0.1',
      network_id: '*',
      port: 8555,         // Use a different port than the default
      gas: 0xfffffffffff, // High gas value
      gasPrice: 0x01      // Low gas price
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    goerli: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://goerli.infura.io/v3/${PROJECT_ID}`),
      network_id: 5,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      currency: 'EUR',
      coinmarketcap: CMC_API_KEY,
      token: 'ETH'
    }
  },

  compilers: {
    solc: {
      version: "0.8.21",
    }
  }
};