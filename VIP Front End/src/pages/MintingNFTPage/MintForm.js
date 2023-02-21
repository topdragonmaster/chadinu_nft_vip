import React, {useState} from "react";
import { 
    isCodeAvailable,
} from "utils/contract";
import {
    validate,
    mintNFTCard
} from "./helper";
import { generateQRCode, initializeQRCode } from "utils/qrcodeGenerator";
import { mintingPrice, mintingPriceWithRef } from "constants/config";

import { Card } from "@mui/material";
import { Grid } from "@mui/material";

import { Step } from "react-form-stepper";
import { Stepper } from 'react-form-stepper';

// Vision UI Dashboard React components
import VuiBox from "components/VUI/VuiBox";
import VuiTypography from "components/VUI/VuiTypography";
import VuiButton from "components/VUI/VuiButton";

import { useWeb3React } from '@web3-react/core';

import FormField from "./FormField";
import { useFormik } from 'formik';

import AvatarImage from "./AvatarImage";
import "./mintForm.css";

const steps = ["Connect Wallet", "Choose Username", "Become a VIP"];

const stepGuides = [
        `1. Click “Connect Wallet” and ensure you’re connected to Ethereum Mainnet. Only one VIP Card per wallet & is non-transferable.💎`,
        `2. This wallet/VIP Card combination will be your key to the Chad Inu Kingdom. Choose your username wisely. 🧠`,
        `3. Click "Mint Your Card" below and approve the transaction in your wallet. Allow up to 15 seconds for completion. 🔥`
    ];

function MintForm(props) {
    const {isRef, isWhite, referrerID, mintCompleted} = props;
    const {active, account} = useWeb3React();
    const [activeStep, setActiveStep] = useState(active ? 1 : 0);
    const [isMinting, setIsMinting] = useState(false);
    const [isUserIDValid, setIsUserIDValid] = useState(false);
    const [isReferrerIDValid, setIsReferrerIDValid] = useState(false);
    const [mintPrice, setMintPrice] = useState("");
    const [passedReferrerID, setPassedReferrerID] = useState(referrerID=="1" ? "" : referrerID);

    const formik = useFormik({
        initialValues: {
          userID: '',
          referrerID: passedReferrerID.replace(/[^a-zA-Z0-9_]/g, '').toUpperCase(),
        },

        validate: async (values) => {
            let errors= await validate(values, active, isWhite, setIsUserIDValid, setIsReferrerIDValid, setMintPrice, setActiveStep);
            if ( !!errors.userID === false ) {
                let success = await generateQRCode(values.userID);
                console.log("qr code is loaded")
                if ( !success ) alert("You can't load QR Code.");
            }
            else initializeQRCode();
            
            return errors;
        },

        onSubmit: async (values) => {
            // let url = await createAndUploadMetaData("first", "deedfdfd");
            // console.log(url, "urldd");
            await mintNFTCard(
                values, active, account, mintPrice, isWhite, isMinting, 
                setIsMinting, setActiveStep, mintCompleted
            );
        }
    });

    React.useEffect(async ()=> {
        
        if (active) {
            setActiveStep(1);
        }
        else {
            setActiveStep(0);
        }
        
        if (props.referrerID==1) {
            setMintPrice(mintingPrice);
            setIsReferrerIDValid(true);
        } else {
            
            if (props.referrerID.length>1 && props.referrerID.length<16) {
                let isValid = await isCodeAvailable(referrerID);
                setIsReferrerIDValid(!isValid);
                setMintPrice(!isValid ? mintingPriceWithRef : mintingPrice);
            } else {
                setMintPrice(mintingPrice);
                setIsReferrerIDValid(false);
                setPassedReferrerID("");
            }
        }
    }, [active, account, props.referrerID]);

    return(
        <div className="mint-form">
            <div className="mint-text">
                    <span>MINT &amp; BECOME A VIP</span>
            </div>
            <Grid container justifyContent="center" sx={{ height: "100%" }}>
                <Grid item xs={12} lg={9} sm={12}>
                    
                    <Stepper activeStep={activeStep} style={{color: "white"}}>
                        {steps.map((label, i) => (
                            <Step 
                                key={i}
                                label={label}
                                styleConfig={{
                                    activeBgColor: "#0075ff", 
                                    completedBgColor: "#01b574", 
                                    inactiveTextColor: "#cbd5e0",
                                    activeTextColor: "#ffffff",
                                    completedTextColor: "#e9ecef"
                                }} 
                            ></Step>
                        ))}
                    </Stepper>

                </Grid>
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid container item xs={12} lg={6} spacing={3} alignItems="center">
                        <Grid item xs={12}>
                            
                            <VuiTypography ml={2} variant="h5" sx={{ mb: 3, letterSpacing: "3px" }} color="white" fontWeight="regular">
                                {stepGuides[activeStep]}
                            </VuiTypography>
                            
                            <form onSubmit={formik.handleSubmit}>
                                <Card sx={{ overflow: "visible", zIndex: 10, marginTop: 0 }}>
                                    <div className="price-text">
                                        {!isWhite && !mintPrice==0 ? (<><span>{mintPrice}</span><span className="in-chadinu-text"> ETH</span></>) : "Free"}
                                    </div>
                                    <VuiBox mt={2}>
                                        <FormField 
                                            id="userID"
                                            name="userID"
                                            type="text"
                                            label="Username"
                                            onChange={formik.handleChange}
                                            
                                            onBlur={formik.handleBlur}
                                            value={formik.values.userID.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 15).toLocaleUpperCase()}
                                            success={!formik.errors.userID&&formik.values.userID.length>0}
                                            error={formik.errors.userID && isUserIDValid && formik.touched.userID}
                                        />
                                        {formik.touched.userID && formik.errors.userID ? (
                                            <VuiBox mt={0.75}>
                                                <VuiTypography component="div" variant="caption" color="error">
                                                    {formik.errors.userID}
                                                </VuiTypography>
                                            </VuiBox>
                                        ) : null }
                                        
                                    </VuiBox>
                                    {isRef && (<VuiBox mt={2}>
                                        <FormField 
                                            id="referrerID"
                                            name="referrerID"
                                            type="text"
                                            label="Referrer Username (optional)"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={isWhite?"":formik.values.referrerID.replace(/[^a-zA-Z0-9_]/g, '').substring(0, 15).toUpperCase()}
                                            success={!formik.errors.referrerID && formik.values.referrerID.length>0 && isReferrerIDValid}
                                            error={formik.errors.referrerID && formik.touched.referrerID||(!isReferrerIDValid&&formik.values.referrerID.length>0)}
                                            disabled={isWhite}
                                        />
                                        {formik.touched.referrerID && formik.errors.referrerID ? (
                                            <VuiBox mt={0.75}>
                                                <VuiTypography component="div" variant="caption" color="error">
                                                    {formik.errors.referrerID}
                                                </VuiTypography>
                                            </VuiBox>
                                        ) : null }
                                        
                                    </VuiBox>)}
                                </Card>
                                <VuiBox mt={2} className="button-group" >
                                    <VuiButton 
                                        type="submit" 
                                        variant="contained" 
                                        color="info" 
                                        disabled={isMinting || (!active && !isWhite)} 
                                        style={{marginLeft: "9px"}}
                                        sx={{fontSize: "14px"}}
                                    >
                                        Mint Your Card
                                    </VuiButton>
                                </VuiBox>
                            </form>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} lg={6} alignItems="center">
                        <Grid item xs={12}>
                            <VuiBox mt={2} style={{opacity: 1}}>
                                <AvatarImage userID={isUserIDValid ? formik.values.userID : undefined} />
                            </VuiBox>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default MintForm;