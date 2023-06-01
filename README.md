# Filecoin Data Tools (FDT) Deal Monitor
This is an example daemon that listens to events emitted from a smart contract and Filecoin and passes
them to [Edge-UR](https://docs.filecoindata.tools/about/edge-ur/overview-of-edge-ur) for aggregation and storage on Filecoin.

This is intended as an example flow and for use in demos and hackathons, this is not intended for use in production
and entirely use at your own risk.

There is an example contract in `contracts` that has the event and a method you can call to initiate the storage.

## Installation
1. Clone this repository locally:
   `git clone https://github.com/hammertoe/fdt-deal-monitor.git`
2. `cd fdt-deal-monitor`
3. Install dependancies: `yarn install`

## Deploying the contract

1. Set you PRIVATE_KEY:
   `export PRIVATE_KEY=xxxx`
2. `yarn hardhat deploy`

## Running the daemon

You need to specify the RPC endpoint of a Filecoin node, the Edge-UR API address, and the contract address, in the `.env` file, then start the daemon with:

1. `node fdt-deal-monitor-ethers.js`

## Invoking the contract

You can call the contract to get it to pass an existing CID to the Edge-UR instance to store:

1. `yarn hardhat store-data --contract 0x3f6748D2e66b4634Cc9b570f0Ac8b89AED963b21 --uri https://bafybeie4og2w7u6c5sq5sfeajrnohqvs6i4fjjqruayopr2xbmapahrn5i.ipfs.dweb.link/dataverse_logo.png`
