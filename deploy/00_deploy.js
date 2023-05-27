require("hardhat-deploy")
require("hardhat-deploy-ethers")

//const private_key = network.config.accounts[0]
//const wallet = new ethers.Wallet(private_key, ethers.provider)

module.exports = async ({ deployments }) => {
    const { deploy } = deployments;
    //console.log("Wallet Ethereum Address:", wallet.address)
    const accounts = await ethers.getSigners();
    //deploy DealClient
    /*
    const EdgeURContract = await deploy("EdgeURContract", {
        from: accounts[0],
        args: [],
        log: true,
    });
    */

    //deploy Cid
    const Cid = await ethers.getContractFactory('Cid', accounts[0]);
    console.log('Deploying Cid...');
    const cid = await Cid.deploy();
    await cid.deployed()
    console.log('Cid deployed to:', cid.address);

    //deploy Proof
    const Proof = await ethers.getContractFactory('Proof', {
        libraries: {
            Cid: cid.address,
        },
    });
    console.log('Deploying Proof...');
    const proof = await Proof.deploy();
    await proof.deployed()
    console.log('Proof deployed to:', proof.address);

    //deploy EdgeUR Aggregator
    const Aggregator = await ethers.getContractFactory('EdgeURContract', {
        libraries: {
            Cid: cid.address,
        },
    });
    console.log('Deploying EdgeURContract...');
    const aggregator = await Aggregator.deploy();
    await aggregator.deployed()
    console.log('EdgeURContract deployed to:', aggregator.address);
}