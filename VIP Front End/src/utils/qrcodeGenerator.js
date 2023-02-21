import { domain } from "constants/config";

const size = 60;
const bgColor = "c4cdb5";

var img;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const loadQRImage = async (userID) => {
    let success = true;
    var canvas = document.getElementById('qr-canvas');
    // Get a 2D context.
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.7;

    let url = domain + userID.toUpperCase();
    // create new image object to use as pattern
    img = new Image();
    img.crossOrigin="anonymous";
    img.src = `http://api.qrserver.com/v1/create-qr-code/?data=${url}!&size=${size}x${size}&bgcolor=${bgColor}`;
    img.onload = async () =>{
        // Create pattern and don't repeat! 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var ptrn = ctx.createPattern(img,'no-repeat');
        ctx.fillStyle = ptrn;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    img.onerror = () => { 
        console.log("there is an eeror")
        success = false;
    };
    while(!img.complete) {
        await sleep(1000);
    }
    return success && img.complete;
}

export const generateQRCode = async (userID) => {
    return await loadQRImage(userID);
}   

export const initializeQRCode = () => {
    var canvas = document.getElementById('qr-canvas');
    // Get a 2D context.
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}