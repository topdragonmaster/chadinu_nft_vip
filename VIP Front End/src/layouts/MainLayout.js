import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Header from "../components/Headers/Header";
import MintingNFTPage from "pages/MintingNFTPage";
import ReferralDashboard from "pages/ReferralDashborad";

export default function MainLayout() {
  return (
    <>
      <div className="container">
        {/* Header */}
        <Header/>
        <div>
            <Switch>
                <Route path="/referral/dashboard" exact component={ReferralDashboard} />
                <Route path="/:referrerID" exact component={MintingNFTPage} />
                <Redirect from="/" to="/1" />
            </Switch>
        </div>
      </div>
    </>
  );
}
