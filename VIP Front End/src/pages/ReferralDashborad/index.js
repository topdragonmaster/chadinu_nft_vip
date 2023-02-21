import React, { useState, useRef } from "react";
import { getSubReferral, getReferralDeadline, getUsercode, getSubReferralLength } from "../../utils/contract";
import {  calDateFromSeconds, getTimestamp } from "utils/util";
import ReferralTable from "./tables";
import AnalyticBoard from "./AnalyticBoard";
import { useWeb3React } from '@web3-react/core';
import { maxShowReferralNum } from "constants/config";
import "./styles.css";

function ReferralDashBoard() {
    const {active, account} = useWeb3React();
    const currentTimestamp = useRef(0);
    const [referrals, setReferrals] = React.useState([]);
    const [totalRewards, setTotalRewards] = React.useState(0);
    const referralDeadline = useRef(0);
    const [referralNum, setReferralNum] = React.useState(0);
    const [secondRefNum, setSecondRefNum] = React.useState(0);
    const [usercode, setUsercode] = useState("");

    const loadReferrals = async (account) => {
        let _referrals = [];
        try {
            let referralLength = await getSubReferralLength(account);
            if (referrals!=null && referralLength!=0) {
                _referrals = await getSubReferral(account, Math.max(0, referralLength - maxShowReferralNum - 1), --referralLength);
                await postProcessReferrals(_referrals);
            }
        } catch(error) {
            await postProcessReferrals([]);
        }
    }

    const postProcessReferrals = async (_referrals) => {
        let referrals_ = [];
        let secondRefCount = 0;
        
        for(let i=Math.floor(_referrals.length/7)-1; i >=0 ; i--) {
            let duration = referralDeadline.current - (currentTimestamp.current - _referrals[i*7+3])
            let deadline = await calDateFromSeconds(duration);
            // console.log(deadline, duration, currentTimestamp.current, referralDeadline.current);
            
            let flag = 0;
            if (deadline === "-") flag = 1;
            referrals_.push({
                usercode: _referrals[i*7+1],
                address: "0x" + _referrals[i*7+2],
                creationTime: _referrals[i*7+3],
                rewardAmount: _referrals[i*7+4] / 1000000,
                isReferred: parseInt(_referrals[i*7+5]),
                secondRefTime: _referrals[i*7+6],
                isExpired: parseInt(_referrals[i*7+7]) + flag,
                deadline: deadline,
                currentTimestamp: currentTimestamp.current
            });
            if (_referrals[i*7+5] !== "0") secondRefCount += 1;
        }
        setReferrals(referrals_);
        getTotalRewards(referrals_);
        setReferralNum(referrals_.length);
        setSecondRefNum(secondRefCount);
    }

    const getTotalRewards = (referrals_) => {
        let totalRewards = 0;
        referrals_.forEach(referral => {
            totalRewards += referral.rewardAmount;
            if (referral.isReferred > 0)
                totalRewards += referral.rewardAmount;
        });
        setTotalRewards(totalRewards.toFixed(2));
    }

    const setReferralDeadline = async () => {
        let _referralDeadline = await getReferralDeadline();
        referralDeadline.current = _referralDeadline;
    }

    const refresh = async () => {
        let _currentTimestamp = await getTimestamp();
        currentTimestamp.current = _currentTimestamp;
        loadReferrals(account);
    }
    const initialize = async () => {
        let _currentTimestamp = await getTimestamp();
        currentTimestamp.current = _currentTimestamp;
        if (active) {
            await loadReferrals(account);
        } else {
            setReferrals([]);
            setReferralNum(0);
            setTotalRewards(0.00);
        }
    };

    React.useEffect(async () => {
        // let _currentTimestamp = await getTimestamp();
        await setReferralDeadline();
        await initialize();
        if (active) {
            let code = await getUsercode(account);
            setUsercode(code);
        }
    }, [active, account]);

    return (
        <>
            <div style={{marginTop: "110px"}}>
                {active && usercode!="" &&(<div className="usercode-text">
                    <span style={{fontSize: "2.2rem", letterSpacing: "3px", lineHeight: "2.6rem"}}><span style={{fontWeight: "bold", fontFamily: "myfont", letterSpacing: "0px", fontSize: "2.2rem"}}>{usercode}</span>'s VIP Dashboard</span>
                </div>)}
                <AnalyticBoard 
                    totalRewards={(totalRewards/10**12).toFixed(4)} 
                    referralNum={referralNum}
                    secondRefNum={secondRefNum}
                />
                <ReferralTable 
                    referrals={referrals} 
                    referralDeadline={referralDeadline.current}
                    refresh = {refresh}
                />
            </div>
        </>
    );
}
export default ReferralDashBoard;