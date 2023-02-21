import React, {memo} from "react";
import WalletButton from "components/ConnectWalletButton";
import "./header.css";

function Header() {
  return (
        <>
            {/* Header */}
            <div className="row" style={{marginTop: "1.5rem"}}>
                <div className="logo-content">
                    <div><img src={require("assets/img/Chad Inu Logo.png").default} alt="No Logo Image"/></div>
                </div>
                <div className="col-12">
                    <div className="float-right">
                        <WalletButton />
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default Header = memo(Header)