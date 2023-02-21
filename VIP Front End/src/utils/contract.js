import Web3 from 'web3';
import { rpcUrl, contractAddress, chainId } from "../constants/config";
import { nftABI } from '../constants/nftABI';

const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const getContract = (abiData, address) => {
    const abi = abiData;
    let contract = new web3.eth.Contract(abi , address);
    return contract;
}

const splitString = (str) => {
    return str.split("#");
}

const contract = getContract(nftABI, contractAddress);

export const getEthBalance = async (address) => {
    let balance =await web3.eth.getBalance(address);
    return balance;
}

export const isBlacklisted = async (address) => {
    let _isBlacklisted = await contract.methods.isBlacklisted(address).call();
    return _isBlacklisted;
}

export const getUsercode = async (address) => {
    let usercode = await contract.methods.getUsercode(address).call();
    return usercode;
}

export const isWhitelisted = async (address) => {
    let flag = await contract.methods.checkWhitelisted(address).call();
    return flag;
}

export const isCodeAvailable = async (code) => {
    let isAvailable = await contract.methods.isCodeAvailable(code).call();
    return isAvailable;
}

export const getIdOfUser = async (address) => {
    let id = await contract.methods.getIdOfUser(address).call();
    return id;
}

export const getTokenURI = async (id) => {
    let tokenUri = await contract.methods.tokenURI(id).call();
    return tokenUri;
}

export const getSubReferral = async (address, startIndex, endIndex) => {
    let subReferral = [];
    try {
        subReferral =await contract.methods.getSubReferral(address, startIndex, endIndex).call();
        return splitString(subReferral);
    } catch(error) {
        console.log(error);
        return null;
    }
}

export const getSubReferralLength = async (address) => {
    let referralLength = await contract.methods.getSubReferralLength(address).call();
    return referralLength;
}


export const getReferralDeadline = async () => {
    let referralDeadline = await contract.methods.referralDeadline().call();
    return referralDeadline;
}

export const mintWithoutReferrer = async (address, usercode, tokenUri, ethAmount) => {
    try{
        let dataABI = contract.methods.MintVIPCard(usercode, tokenUri).encodeABI();
        let txHash = await signTransaction(address, dataABI, ethAmount);
        return txHash;
    } catch(err) {
        console.log(err);
        return null;
    }
}

export const mintWithReferrer = async (address, usercode, referrerCode, tokenUri, ethAmount) => {
    try{
        let dataABI = contract.methods.MintVIPCardWithReferreral(usercode, referrerCode, tokenUri).encodeABI();
        let txHash = await signTransaction(address, dataABI, ethAmount);
        return txHash;
    } catch(err) {
        console.log(err);
        return null;
    }
}

// sign transaction using metamask
const signTransaction = async (address, dataABI, _etherAmount) => {

    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: dataABI,
        gasLimit: "0x5208",
        chainId: chainId,
        value: parseInt(_etherAmount).toString(16),  // this should be hex !!!!
      };
    
    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
        return await checkTx(txHash);
    } catch (error) {
        alert("There was an error minting your card. Please try again.");
        console.log(error);
        return null;
    }
}

const checkTx = async (txHash) => {
    // let result = await web3.eth.getTransaction(txHash)
    let result = null;
    while(result==null) {
        result = await web3.eth.getTransactionReceipt(txHash.toString());
    }
    if (result.status) return txHash;
    else return null;
}