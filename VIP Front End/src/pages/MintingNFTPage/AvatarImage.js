import {useState, useEffect} from "react";
import QRComponent from "./QRComponent";
import "./avatarImg.css";


const AvatarImage = (props)=>{
    const [userID, setUserID] = useState("");

    useEffect(()=>{
        if (props.userID!=undefined&&props.userID!="") {
            setUserID(props.userID);
        } else {
            setUserID("");
        }
    }, [props.userID]);

    return(
        <>
            <div className="avatar-wrapper">
                <div id="avatar-container">
                    <div>
                        <img src={require("assets/img/vip_back.png").default} alt=""/>
                    </div>
                    <QRComponent
                    //  userID={userID} 
                    />
                    
                    <div className="user-id-text">
                        <div>{userID.toUpperCase()}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AvatarImage;