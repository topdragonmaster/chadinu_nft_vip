import Web3 from 'web3';
import { rpcUrl, openseaThreshold } from "../constants/config";
import { getIdOfUser, getTokenURI } from './contract';
import axios from 'axios';

export const getImgUrlFromTokenUri = async (tokenUri) => {
    let data = await axios.get(tokenUri.replace(/"/g, ""));
    return data?.data?.image;
}

export const getImgUrl = async (account) => {
    let id = await getIdOfUser(account);
    let tokenUri = await getTokenURI(id);
    if (id <= openseaThreshold) {
        return tokenUri;
    } else {
        let imageUrl = await getImgUrlFromTokenUri(tokenUri);
        return imageUrl;
    }
}

export const getTimestamp = async () => {
    var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    var blockNumber =await web3.eth.getBlockNumber();
    var block = await web3.eth.getBlock(blockNumber);
    return block["timestamp"];
}

export const getDateFromTimestamp = (blockTime) => {
    if (blockTime===0) return "-"
    else {
        const date = new Date(blockTime*1000);
        return date.toLocaleDateString("en-US");
    }
}

export const calDateFromSeconds = (duration) => {
    duration = parseInt(duration);
    if (duration <= 0) return "-";
    else if (duration < 3600) {

        if (duration % 60 === 0) return (Math.floor(duration/60) + " mins");
        else return (Math.floor(duration/60) + " mins " + duration%60 + " seconds");

    } else if (duration < 86400) {

        if (Math.floor((duration%3600)/60) === 0) return (Math.floor(duration/3600) + " hours");
        else return (Math.floor(duration/3600) + " hours " + Math.floor((duration%3600)/60) + " mins");

    } else {

        if (Math.floor((duration%86400)/3600) === 0) return (Math.floor(duration/86400) + " days");
        else return (Math.floor(duration/86400) + " days " + Math.floor((duration%86400)/3600) + " hours");

    }
}