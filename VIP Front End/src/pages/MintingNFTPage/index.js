import React, {useState} from "react";
import MintForm from "./MintForm";
import CardInfo from "./CardInfo";

import { isWhitelisted, getUsercode } from "utils/contract";
import { useWeb3React } from '@web3-react/core';

function MintingNFTPage(props) {
    const [isWhite, setIsWhite] = useState(false);

    const { active, account } = useWeb3React();
    // const account = "0x370713bad42179a045c690c8f20acc7e7b78df3b"
    const [referrerID, setReferrerID] =useState(props.match.params.referrerID);
    const [hasNFT, setHasNFT] = useState(undefined);

    const initialize = async () => {
        const usercode = await getUsercode(account);
        
        if (usercode.length==0) {
            setHasNFT(false);
            let flag = await isWhitelisted(account);
            setIsWhite(flag);
            if (flag) setReferrerID("1");
        } else {
            setHasNFT(true);
        }
    }

    const mintCompleted = () => {
        setHasNFT(true);
    }

    React.useEffect(async() => {
        if (active) {
            await initialize();
        } else {
            setIsWhite(false);
            setHasNFT(null)
        }
    }, [active, account]);

    return (
        <>
            {hasNFT!==null ? 
                (!hasNFT ? (
                    <MintForm 
                        isWhite={isWhite} 
                        isRef={true} 
                        referrerID={referrerID.toUpperCase()} 
                        mintCompleted={mintCompleted} 
                    />
                    ) : <CardInfo />)
                : <MintForm 
                    isWhite={isWhite} 
                    isRef={true} 
                    referrerID={referrerID.toUpperCase()} 
                    mintCompleted={mintCompleted} 
                />
            }
        </>
    );
}

export default MintingNFTPage;