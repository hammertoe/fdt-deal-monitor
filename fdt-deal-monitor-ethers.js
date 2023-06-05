const FormData = require('form-data');
const axios = require('axios');
const { ethers } = require('hardhat');
const db = require('diskdb');
require('dotenv').config();


async function main() {

  // Get args
  const rpcEndpoint = process.env.rpcEndpoint;
  const apiEndpoint = process.env.apiEndpoint + "/content/fetch-url";
  const contractAddress = process.env.contractAddress;
  const API_KEY = process.env.API_KEY;

  // Open the database
  db.connect('db', ['storage']);

  // Create a new ethers provider
  const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider)

  // Compile the contract
  const contractName = 'EdgeURContract';
  const contractFactory = await ethers.getContractFactory(contractName, wallet);
  const contract = await contractFactory.attach(contractAddress)

  console.log(`Listening for events on contract at address: ${contractAddress} at RPC endpoint: ${rpcEndpoint}`);
  const contractABI = contract.interface.abi;

  // Specify the event name you want to listen to
  const eventName = 'StoreURIEvent(string)';

  // Create an event filter
  const eventFilter = {
    address: contractAddress,
    topics: [ethers.utils.id(eventName)]
  };

  // Create an event listener
  const listener = async (log) => {
    // Parse the event data from the log
    const event = ethers.utils.defaultAbiCoder.decode(
      ['string'],
      log.data
    );

    // New form object
    const formData = new FormData();

    // Construct the form data payload
    const uri = event[0];
    formData.append('data_url', uri);

    const postHeaders = {
      headers: {
          Authorization: `Bearer ${API_KEY}`,
          ...formData.getHeaders()
      }
    }

    console.log("Sending payload to: ", apiEndpoint);

    // Make the HTTP API POST request with the event data
    let retData;
    try {
      const response = await axios.post(apiEndpoint, formData, postHeaders);
      retData = response.data
      console.log('API response:', retData);
    } catch (error) {
      console.error('API request failed:', error.message);
      return null;
    }

    // Store the data a local database
    let contents;
    try {
      console.log("Storing data locally")
      contents = retData.contents[0];
      db.storage.save(contents);
      console.log(`Success stored id ${contents.ID}`);
    } catch (error) {
      console.error('Local storage failed:', error.message);
      return null;
    }

    // Update smart contract
    console.log("Updating smart contract");
    transaction = await contract.updateJobId(uri, contents.ID, contents.cid)
    transactionReceipt = await transaction.wait()
    console.log("Complete!", transactionReceipt)
  };

  // Subscribe to the event
  provider.on(eventFilter, listener);

  // Unsubscribe from the event when the process is terminated
  process.on('SIGINT', async () => {
    try {
      provider.off(eventFilter, listener);
      console.log('Unsubscribed from the event.');
      process.exit(0);
    } catch (error) {
      console.error('Error unsubscribing from the event:', error);
      process.exit(1);
    }
  });
}

main().catch((error) => {
  console.error('An error occurrd:', error);
  process.exit(1);
});
