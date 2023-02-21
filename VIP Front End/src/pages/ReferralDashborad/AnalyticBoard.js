import React from "react";
import Grid from "@mui/material/Grid";
import MiniStatisticsCard from "components/Cards/StatisticsCards/MiniStatisticsCard";
import VuiBox from "components/VUI/VuiBox";

// React icons
import { AiFillGift } from "react-icons/ai";
import { IoGlobe } from "react-icons/io5";
import { AiOutlineGift } from "react-icons/ai";


function AnalyticBoard(props) {

    const { totalRewards, referralNum, secondRefNum } = props;

    React.useLayoutEffect(() => {
    }, []);

    return (
        <>
            <VuiBox mt={4.5}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} xl={4}>
                        <MiniStatisticsCard
                            title={{ text: "Total Rewards (Ether)", fontWeight: "bold"}}
                            count={totalRewards}
                            icon={{ color: "info", component: <IoGlobe size="22px" color="white" /> }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={4}>
                        <MiniStatisticsCard
                            title={{ text: "Referral Count", fontWeight: "bold" }}
                            count={referralNum}
                            icon={{ color: "info", component: <AiFillGift size="22px" color="white" /> }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} xl={4}>
                        <MiniStatisticsCard
                            title={{ text: "Second Tier Referral Count", fontWeight: "bold" }}
                            count={secondRefNum}
                            icon={{ color: "info", component: <AiOutlineGift size="22px" color="white" /> }}
                        />
                    </Grid>
                </Grid>
            </VuiBox>
        </>
    );
}
export default AnalyticBoard;