import { ethers } from './ethers-5.6.esm.min.js';
import { abi, contractAddress } from './constants.js';

const connectButton = document.getElementById('connectButton');
const fundButton = document.getElementById('fundButton');
const withdrawButton = document.getElementById('withdrawButton');
const balanceButton = document.getElementById('balanceButton');

const connect = async () => {
  if (typeof window.ethereum !== undefined) {
    await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    connectButton.innerHTML = 'You are connected';
  } else {
    connectButton.innerHTML = 'Connect';
  }
};

const fund = async () => {
  const ethAmount = document.getElementById('ethAmount').value;
  console.log('funding', ethAmount);

  if (typeof window.ethereum !== undefined) {
    // 1. provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // 2. signer
    const signer = provider.getSigner();

    // 3. contract
    // 4. abi & address
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      await listenForTransactionMined(transactionResponse, provider);
      console.log('done');
    } catch (err) {
      console.log('something went wrong');
      console.log(err);
    }
  }
};

const listenForTransactionMined = (transactionResponse, provider) => {
  console.log(`Mining ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with: ${transactionReceipt.confirmations} confirmations`
      );

      resolve();
    });
  });
};

const withdraw = async () => {
  if (typeof window.ethereum !== undefined) {
    console.log('withdraw');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();

      await listenForTransactionMined(transactionResponse, provider);
      console.log('done');
    } catch (err) {
      console.log('something went wrong');
      console.log(err);
    }
  }
};

const getBalance = async () => {
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
};

connectButton.onclick = connect;
fundButton.onclick = fund;
withdrawButton.onclick = withdraw;
balanceButton.onclick = getBalance;
