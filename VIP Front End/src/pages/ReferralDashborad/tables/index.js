// @mui material components
import Card from "@mui/material/Card";

import { useState, useEffect } from "react";
// Vision UI Dashboard React components
import VuiBox from "components/VUI/VuiBox";
import VuiTypography from "components/VUI/VuiTypography";
import Table from "components/Tables/Table";
import VuiButton from "components/VUI/VuiButton";

import CardView from "../CardView";
import CopyClipboard from "components/Copyboard";
// Data
import referralsTableData from "./data/referralsTableData";
import { useWeb3React } from '@web3-react/core';
import { getUsercode } from "utils/contract";
import { domain } from "constants/config";

function ReferralTable(props) {
  const { columns, rowFunction } = referralsTableData;
  const {active, account} = useWeb3React();
  const { referrals, referralDeadline, refresh } = props;
  const rows = rowFunction(referrals, referralDeadline);
  const [isCardViewOpen, setIsCardViewOpen] = useState(false);
  const [usercode, setUsercode] = useState("");

  function toggleCardView() {
    setIsCardViewOpen(!isCardViewOpen);
  }
  useEffect(async()=>{
    if (active) {
      let code = await getUsercode(account);
      setUsercode(code);
    }
  }, [active, account]);

  return (
      <VuiBox py={1.5}>
        <VuiTypography
          textAlign="center"
          variant="h5"
          fontWeight="medium"
          color="white"
          sx={{ mb: 1, mr: 1, mt: 1, letterSpacing: "0px" }}
        >
          Share your referral link with Chads to EARN REWARDS! 🤝
        </VuiTypography>
        <VuiBox
          width="100%"
          display="flex"
          justifyContent="center"
          mt="14px"
          alignItems="center"
        >
          <VuiTypography
            textAlign="center"
            variant="h5"
            fontWeight="medium"
            color="white"
            sx={{ mb: 2, mr: 1, letterSpacing: "0px" }}
          >
            {domain+usercode}
          </VuiTypography>
          <CopyClipboard text={domain+usercode} />
      </VuiBox>
      <VuiBox py={1.5}>
        <Card>
          <VuiBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <VuiTypography variant="lg" color="white" >
              Your Referrals
            </VuiTypography>
            <VuiButton variant="contained" color="info" onClick={toggleCardView} sx={{fontSize: "14px"}} >
              Your VIP Card
            </VuiButton>
            <VuiButton variant="contained" color="info" onClick={refresh} sx={{fontSize: "14px", ml: 0.5}}>
              Refresh
            </VuiButton>
          </VuiBox>
          <VuiBox
            sx={{
              "& th": {
                borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                  `${borderWidth[1]} solid ${grey[700]}`,
              },
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
              },
            }}
          >
            <Table columns={columns} rows={rows} />
          </VuiBox>
        </Card>
      </VuiBox>
      <CardView isOpen={isCardViewOpen} toggleModal={toggleCardView} />
    </VuiBox>
  );
}

export default ReferralTable;
