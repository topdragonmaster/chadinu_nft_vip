import {useState, useEffect} from "react";
import { Grid } from "@mui/material";
import VuiTypography from "components/VUI/VuiTypography";
import VuiBox from "components/VUI/VuiBox";
import VuiButton from "components/VUI/VuiButton";
import { Link } from "react-router-dom";

import { getUsercode } from "utils/contract";
import { baseUrl, domain } from "constants/config";
import { download } from "utils/downloader";
import { useWeb3React } from '@web3-react/core';
import CopyClipboard from "components/Copyboard";
import { getImgUrl } from "utils/util";
import "./cardInfo.css";

const CardInfo = ()=>{
    const {active, account} = useWeb3React();
    const [nftUri, setNftUri] = useState("");
    const [usercode, setUsercode] = useState("");

    const downloadCard = (nftUri) => {
        if (window.innerWidth > 900) {
            download(nftUri);
        } else {
            alert("Please take a screenshot of your VIP card.")
        }
    }

    useEffect(async()=>{
        if (active) {
            // const account = "0x370713bad42179a045c690c8f20acc7e7b78df3b";
            let _usercode = await getUsercode(account)
            setUsercode(_usercode)
            let imageUrl = await getImgUrl(account)
            setNftUri(imageUrl)
        }
    }, [active, account]);

    return(
        <div  className="card-info">
            <Grid container spacing={3} justifyContent="space-between">
                <Grid container item xs={12} sm={12} md={12} lg={6} spacing={3}  alignItems="center">
                    <Grid item xs={12} sm={12}>
                        <VuiTypography
                            textAlign="center"
                            variant={window.innerWidth > 414 ? "h1" : "h2"}
                            fontWeight="bold"
                            color="white"
                            mb="10px"
                            sx={{ mb: 1, letterSpacing: "1.5px" }}
                        >
                            Congratulations!
                        </VuiTypography>
                        
                        <VuiTypography
                            textAlign="center"
                            variant="h3"
                            fontWeight="medium"
                            color="white"
                            mb="10px"
                            sx={{ letterSpacing: "3px" }}
                        >
                            You are a Chad Inu VIP Partner. Save a copy of your VIP Card to your device, and SHARE with fellow Chads to start earning REWARDS! 🍻
                        </VuiTypography>
                        
                        <VuiBox width="100%" display="flex" flexDirection="row" justifyContent="center">
                            <VuiBox
                                display="flex"
                                justifyContent="space-between"
                                alignItems={{ xs: "center", md: "flex-end" }}
                                flexDirection={{ xs: "column", md: "row" }}
                                mt="1.5rem"
                            >
                                <VuiTypography
                                    textAlign="center"
                                    variant="h5"
                                    fontWeight="medium"
                                    mr="10px"
                                    sx={{ mb: 1, letterSpacing: "0px" }}
                                >
                                    {domain+usercode}
                                </VuiTypography>
                                <CopyClipboard text={domain+usercode} />
                            </VuiBox>
                        </VuiBox>
                        
                        <VuiBox width="100%" mt={2} display="flex" flexDirection="row" justifyContent="center">
                            {window.innerWidth > 900 ?
                                (<VuiButton 
                                    variant="contained" 
                                    color="info"
                                    onClick={()=>downloadCard(nftUri, ()=>{})}
                                    sx={{fontSize: "14px"}}
                                >
                                    Download Your Card
                                </VuiButton>) : null}
                            <Link to="/referral/dashboard" style={{textDecoration: "none"}}> 
                                <VuiButton 
                                    style={{marginLeft: "10px"}}
                                    variant="contained" 
                                    color="info"
                                    sx={{fontSize: "14px"}}
                                >
                                    Visit Your VIP Dashboard
                                </VuiButton>
                            </Link>
                        </VuiBox>                    
                        {window.innerWidth < 900 ?
                            (<VuiTypography
                                textAlign="center"
                                variant="h4"
                                fontWeight="medium"
                                sx={{ mt: 1, letterSpacing: "0px" }}
                            >
                                Screenshot and crop your card to save it to your device
                            </VuiTypography>) : null}
                    </Grid>
                </Grid>

                <Grid container item xs={12} sm={12} md={12} lg={6} spacing={3} alignItems="center">
                    <Grid item xs={12}>
                        <VuiBox mt={window.innerWidth > 900 ? 5 : 1} style={{opacity: 1}}>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                <img className="vip-img" src={nftUri} alt="No NFT Card Image"/>
                            </div>
                        </VuiBox>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default CardInfo;