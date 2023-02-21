import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import CopyClipboard from "components/Copyboard";
import VuiTypography from "components/VUI/VuiTypography";
import VuiBox from "components/VUI/VuiBox";

import { AiFillCloseCircle } from "react-icons/ai";

import { domain } from "constants/config";
import { useWeb3React } from '@web3-react/core';
import { getUsercode } from "utils/contract";
import { getImgUrl } from "utils/util";

Modal.setAppElement("#root");

export default function CardView(props) {
  
  const { isOpen, toggleModal } = props;
  const {active, account} = useWeb3React();
  const [nftUri, setNftUri] = useState("");
  const [usercode, setUsercode] = useState("");

  useEffect(async()=>{
    if (active) {
      // const account = "0xE2e5796864bfD51716b870b72F3b8ec5EbB79a6a";
      let code = await getUsercode(account);
      setUsercode(code);
      let imageUrl = await getImgUrl(account);
      setNftUri(imageUrl);
    }
  }, [active, account]);
  return (
    <div className="card-view">
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
        className="mymodal"
        overlayClassName="myoverlay"
        closeTimeoutMS={500}
      >
        <AiFillCloseCircle onClick={toggleModal} className="icon" size={28}/>
        
        <VuiBox width="99%" mt={5} display="flex" flexDirection="column" justifyContent="center">
          <VuiTypography
            textAlign="center"
            variant="h4"
            fontWeight="medium"
            color="white"
            sx={{ mb: 1, letterSpacing: "0px", ml: 1.3 }}
          >
            Share-to-Earn 💰
          </VuiTypography>
          <VuiBox
            width="100%"
            display="flex"
            justifyContent="space-between"
            mt="4px"
            alignItems="center"
          >
            <VuiTypography
              width="calc(100% - 38px)"
              textAlign="center"
              variant="h5"
              fontWeight="medium"
              color="white"
              sx={{ mb: 1, letterSpacing: "0px" }}
            >
                {domain+usercode}
            </VuiTypography>
              <CopyClipboard text={domain+usercode} />
          </VuiBox>
        </VuiBox>
        <VuiBox mt={2} style={{opacity: 1}}>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div><img style={{width: "100%"}} src={nftUri} alt="No NFT Card Image"/></div>
            </div>
        </VuiBox>
      </Modal>
    </div>
  );
}
