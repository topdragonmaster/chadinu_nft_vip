import { 
    mintWithoutReferrer, 
    mintWithReferrer, 
    isCodeAvailable,
    getUsercode,
    getEthBalance,
} from "utils/contract";
import { mintingPrice, mintingPriceWithRef, baseUrl } from "constants/config";
import { download } from "utils/downloader";
import { upload } from "utils/uploader";

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const checkEtherBalance = async (walletAddress, iswhiteListed, mintPrice) => {
    if (iswhiteListed) return true;
    let ethBalance = await getEthBalance(walletAddress);
    if (ethBalance >= mintPrice * 10**18) return true;
    else {
        alert("You don't have enough ether amount to mint a vip card.");
        return false;
    }
}

export const checkMintabilityOfWallet = async (walletAddress) => {
    let usercode = await getUsercode(walletAddress);
    if(usercode!="") {
        alert("This address already has a NFT");
        return false;
    }
    return true;
}

export const validate = async (
    values, active, isWhite,
    setIsUserIDValid, 
    setIsReferrerIDValid, 
    setMintPrice, 
    setActiveStep
) => {
    const errors = {};
    
    values.userID = values.userID.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
    values.referrerID = values.referrerID.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
    if (values.userID.length > 1 && values.userID.length < 16) {
        let isValid = await isCodeAvailable(values.userID);
        setIsUserIDValid(isValid);
        if (!isValid)
            errors.userID = "Username is already taken. Please choose another one.";
        else {
            if (active) setActiveStep(2);
        }
    } else {
        setIsUserIDValid(false);
        errors.userID = "Username should be between 2-15 characters.";
    }
    
    if (isWhite) return errors;
    
    if (values.referrerID.length > 1 && values.referrerID.length < 16) {
        let isValid = await isCodeAvailable(values.referrerID);
        setIsReferrerIDValid(!isValid);
        if(isValid) {
            errors.referrerID = "Referrer username is incorrect.";
            setMintPrice(mintingPrice);
        }
        else setMintPrice(mintingPriceWithRef);
    } else {
        if (values.referrerID!="")
            errors.referrerID = "Referrer username length should be between 2-15 characters.";
            if (values.referrerID=="") 
                setMintPrice(mintingPrice);
        if (isWhite)
            setMintPrice(mintingPrice);
    }
    return errors;
}


export const mintNFTCard = async (
    values, connected, walletAddress, mintPrice, isWhite, isMinting, 
    setIsMinting, setActiveStep, mintCompleted
) => {
    if (isMinting) return;
    setIsMinting(true);
    console.log("mint is started");
    if (!connected) {
        alert("Connect wallet");
        setIsMinting(false);
        return;
    }
    
    try {
        let isValid = await checkMintabilityOfWallet(walletAddress);
        if(!isValid) {
            setIsMinting(false);
            return;
        } // check wallet has nft or not
        let isBalanceEnough = await checkEtherBalance(walletAddress, isWhite, mintPrice);
        if (!isBalanceEnough) {
            setIsMinting(false);
            return;
        } // check balance
        

        if(isWhite || mintPrice==0) await sleep(2000);

        //  let url ={data: {IpfsHash: "await  Upload(values.userID)"}};
        let url = await  Upload(values.userID);
        console.log("ipfs url: ", url);
        if (url==null) {
            setActiveStep(1);
            values.userID="";
            setIsMinting(false);
            return;
        } // upload image to ipfs

        // call mint function of smart contract
        await mintNFTOnSmartContract(values, url, walletAddress, isWhite, setActiveStep, mintCompleted);
        
    } catch(error) {
        setActiveStep(1);
        values.userID="";
        console.log(error);
    }
    setIsMinting(false);
}

const mintNFTOnSmartContract = async (values, url, walletAddress, isWhite, setActiveStep, mintCompleted) => {
    try{
        let data;
        if (values.referrerID.length>1 && values.referrerID.length<16 && !isWhite) {
            data = await mintWithReferrer(walletAddress, values.userID, values.referrerID, url.data.IpfsHash, mintingPriceWithRef*10**18);
            console.log("tx hash is ", data);
        } else if(isWhite) {
            console.log("frere mint")
            data = await mintWithoutReferrer(walletAddress, values.userID, url.data.IpfsHash, "0");
            console.log("tx hash is ", data);
        } else {
            data = await mintWithoutReferrer(walletAddress, values.userID, url.data.IpfsHash, mintingPrice*10**18);
            console.log("tx hash is ", data);
        }
        
        if (data!==null) {
            setActiveStep(3);
            downloadConfirmAlert(url.data.IpfsHash, mintCompleted);
        } else {
            values.userID="";
            setActiveStep(1);
        }
    } catch (error) {
        values.userID="";
        setActiveStep(1);
        alert("There was an error minting your card. Please try again.");
        console.log(error);
    }
}

const downloadConfirmAlert = async (ipfsHash, mintCompleted) => {
    if (window.innerWidth > 900) {
        if (window.confirm('Click "OK" to save a copy of your VIP Card to your device. Allow up to 10 seconds for it to appear in your download folder.')) {
            // Save it!
            download(baseUrl+ipfsHash);
            mintCompleted();
        } else {
            mintCompleted();
        }
    } else {
        alert("Please take a screenshot of your VIP card.")
        mintCompleted();
    }
}

const Upload = async (userID) => {
    try{
        console.log("Start Uploading");
        // let data = await upload("avatar-container", userID);
        let data = await upload("avatar-container", userID);
        return data;
    } catch(error) {
        return null;
    }
}