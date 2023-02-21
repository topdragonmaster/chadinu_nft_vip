import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { domain } from 'constants/config';

function QRComponent(props) {
    // const { userID } = props;
    const size = 60;
    const bgColor = "c4cdb5";

    // const {active} = useWeb3React();
    // var img;

    // const loadQRImage = async () => {
    //     var canvas = document.getElementById('qr-canvas');
    //     // Get a 2D context.
    //     var ctx = canvas.getContext('2d');
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.globalAlpha = 0.7;

    //     let url = domain + userID.toUpperCase();
    //     // create new image object to use as pattern
    //     img = new Image();
    //     img.crossOrigin="anonymous";
    //     img.src = `http://api.qrserver.com/v1/create-qr-code/?data=${url}!&size=${size}x${size}&bgcolor=${bgColor}`;
    //     img.onload = async () =>{
    //         // Create pattern and don't repeat! 
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         var ptrn = ctx.createPattern(img,'no-repeat');
    //         ctx.fillStyle = ptrn;
    //         ctx.fillRect(0,0,canvas.width,canvas.height);
    //     }
    //     await img.onload();
    // }

    // useEffect(() => {
    //     const generateQRCode = async () => {
    //         if (userID!==undefined&&userID!="") {
    //             await loadQRImage();
    //         } else {
    //             var canvas = document.getElementById('qr-canvas');
    //             // Get a 2D context.
    //             var ctx = canvas.getContext('2d');
    //             ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         }
    //     }
    //     generateQRCode();
    // }, [active, props.userID]);
    
    return (
        <div className='qr-wrapper'>
            <div className='qr-component'>
                <img style={{zIndex: 0, opacity: 1}}  src={require("assets/img/qr-63.png").default} alt="" />
            </div>
            
            <div className='qr-component'>
                <div>
                    <canvas 
                        id="qr-canvas" 
                        height={size} 
                        width={size}
                    ></canvas>
                </div>
            </div>
        </div>
    );
}
  
export default QRComponent;