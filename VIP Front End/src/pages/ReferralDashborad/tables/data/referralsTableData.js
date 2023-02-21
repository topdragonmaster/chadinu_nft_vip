/* eslint-disable react/prop-types */
// Vision UI Dashboard React components
import React from "react";
import VuiBox from "components/VUI/VuiBox";
import VuiTypography from "components/VUI/VuiTypography";
import VuiBadge from "components/VUI/VuiBadge";
import VuiProgress from "components/VUI/VuiProgress";
import { getDateFromTimestamp, calDateFromSeconds } from "utils/util";
import { explorerUrl } from "constants/config";

function SecondTierReferral({referral, referralDeadline}) {

    if (!referral.isExpired) {
        // let expirationDuration = calDayHoursFromTimestamp(parseInt(referral.creationTime), currentTimestamp, referralDeadline);
        let duration = referralDeadline - (referral.currentTimestamp - parseInt(referral.creationTime));
        let expirationDuration = calDateFromSeconds(duration);
        let percentage = 0
        if (referral.currentTimestamp > parseInt(referral.creationTime))
            percentage = (referral.currentTimestamp - parseInt(referral.creationTime)) * 100/referralDeadline;
        return (
            <VuiBox width="8rem" textAlign="center">
                <VuiTypography color="white" variant="lg" fontWeight="bold" mb="8px">
                    {expirationDuration}
                </VuiTypography>
                <VuiProgress value={percentage} color="info" sx={{ background: "#2D2E5F" }} />
            </VuiBox>
        );
    }
    if (referral.isReferred===1) {
        return (<VuiBadge
            variant="standard"
            badgeContent="YES"
            color="success"
            size="xs"
            container
            sx={({ palette: { white, success }, borders: { borderRadius, borderWidth } }) => ({
            background: success.main,
            border: `${borderWidth[1]} solid ${success.main}`,
            borderRadius: borderRadius.md,
            color: white.main,
            })}
        />);
    } else {
        return (<VuiBadge
            variant="standard"
            badgeContent="Expired"
            size="xs"
            container
            sx={({ palette: { white }, borders: { borderRadius, borderWidth } }) => ({
              background: "unset",
              border: `${borderWidth[1]} solid ${white.main}`,
              borderRadius: borderRadius.md,
              color: white.main,
            })}
        />);
    }
    
}

function PendingAmount({referral}) {
    let pendingAmount = "";
    let color = "";
    if (referral.isExpired) {
        if (referral.isReferred===1) {
            pendingAmount = `${(referral.rewardAmount/10**12).toFixed(4)}`;
            color = "success";
        } else {
            pendingAmount = `${(referral.rewardAmount/10**12).toFixed(4)}`;
            color = "error";
        }
    } else {
        pendingAmount = '0/$0';
        color = "info";
    }
    return (<VuiTypography variant="caption" color={color} fontWeight="medium">
               {pendingAmount}
            </VuiTypography>);
}

const generateRows = (referrals, referralDeadline) => {
    let rows = referrals.map((referral, i) => {
        // console.log(referral);
        let row = {};
        row["Username"] = (
            <VuiTypography variant="caption" fontWeight="medium" color="white">
                {referral.usercode || "Undefined"}
            </VuiTypography>
        );
        row["Address"] = (
            <VuiTypography component="a" variant="caption" fontWeight="medium" color="white" href={explorerUrl+referral.address} target="_blank">
                {referral.address.substring(0, 6)}...{referral.address.substring(38, 42)}
            </VuiTypography>
        );
        row["Referral Time"] = (
            <VuiTypography variant="caption" color="white" fontWeight="medium">
               {getDateFromTimestamp(referral.creationTime)}
             </VuiTypography>
        );
        row["Reward Amount (Eth)"] = (
            <VuiTypography variant="caption" color="white" fontWeight="medium">
               {(referral.rewardAmount/10**12).toFixed(4)}
             </VuiTypography>
        );
        row["Second Tier Referral Status"] = (
            <SecondTierReferral referral={referral} referralDeadline={referralDeadline}/>
        );
        row["Second Tier Remaining Time"] = (
            <VuiTypography variant="caption" color="white" fontWeight="medium">
                {referral.isReferred===0 ? "-" : getDateFromTimestamp(referral.secondRefTime)}
            </VuiTypography>
        );
        row["Pending Amount (Eth)"] = (
            <PendingAmount referral={referral} />
        );
        return row;
    })
    return rows;
}

export default {
  columns: [
    { name: "Username", align: "left" },
    { name: "Address", align: "left" },
    { name: "Referral Time", align: "center" },
    { name: "Reward Amount (Eth)", align: "center" },
    { name: "Second Tier Referral Status", align: "center" },
    { name: "Second Tier Remaining Time", align: "center" },
    { name: "Pending Amount (Eth)", align: "center" },
  ],

  rowFunction: generateRows
};
