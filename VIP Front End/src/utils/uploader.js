import axios from 'axios';
import html2canvas from 'html2canvas';
import FormData from 'form-data';
import { pinataApiKey, pinataSecretApiKey, baseUrl } from 'constants/config';

const srcToFile = (src, fileName, mimeType) => {
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
}

const _uploadPinata = async (file) => {
    var fd = new FormData();
    fd.append("file", file);
    const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
        }
    });
    fd.append('pinataMetadata', metadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0
    });
    fd.append('pinataOptions', pinataOptions);

    let response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", fd, {
        maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
            'Content-Type': `multipart/form-data; boundary=${fd._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
        }
    });  
    return response;
}

const uploadToIPFS = async (canvas, imgName) => {
    try {
        let data = canvas.toDataURL('image/jpg');
        let file = await srcToFile(
            data,
            imgName + '.jpg',
            'image/jpg'
        );
        return await _uploadPinata(file);
    } catch (error) {
        console.log("Uploading Error", error);
        return "";
    }
}

export const createAndUploadMetaData = async (ipfsUrl, imgName) => {
    let data = {
        "name": "Chad Inu VIP Club Card",
        "description": "This is the Chad Inu VIP Partners’ Club Card. It is your key to access the Chad Inu Kingdom - only one VIP Card per wallet and is non-transferable. 🔐 Become a Partner and mint your own custom username at https://www.chadinu.io 🔥",
        "image": ipfsUrl,
        "external_link": "https://www.chadinu.vip/referral/dashboard"
    }

    let pinataData = {
        pinataMetadata: {
            name: imgName + ".json",
            keyvalues: {
            }
        },
        pinataContent: data
    }

    let response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", pinataData, {
        headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey
        }
    });  
    return response;
}

export const upload = async (imgurl, imgName)=>{
    if(imgurl === '') return;
    
    const element = await document.getElementById(imgurl);
    const canvas = await html2canvas(element);      

    let url = await uploadToIPFS(canvas, imgName);
    return await createAndUploadMetaData(baseUrl + url.data.IpfsHash, imgName);
}

