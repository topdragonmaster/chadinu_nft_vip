import React, {useEffect, useLayoutEffect, useCallback, memo, useMemo} from 'react'
import { useWalletModal, dark} from '@pancakeswap-libs/uikit'
import { ModalProvider } from "@pancakeswap-libs/uikit";
import { ThemeProvider } from "styled-components";
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer, toast } from "react-toastify";

import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import { URI_AVAILABLE, UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { toBech32 } from '@harmony-js/crypto'

import useEagerConnect from 'hooks/useEagerConnect'
import useInactiveListener from 'hooks/useInactiveListener'

import { getEthBalance } from 'utils/contract';

import {
  injected,
  network,
  walletconnect,
  walletlink
} from 'connectors'
// import Spinner from 'components/Spinner'

// CALL IT ONCE IN YOUR APP
if (typeof window !== "undefined") {
  // console.log("inject style");
}

const connectorsByName = {
  injected: injected,
  network: network,
  walletconnect: walletconnect,
  bsc: walletlink,
}


function Account() {
  var { account, library } = useWeb3React()
  const isHmyLibrary = (library?.messenger?.chainType === 'hmy')
  account = (isHmyLibrary && account) ? toBech32(account) : account

  return (
    <>
      <button type="button" className="mr-2 btn btn-dark">
        {account === null
          ? '-'
          : account
          ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
          : ''}
      </button>
    </>
  )
}

const theme = dark;
theme.colors.text = "#ffffff";
theme.card.background = "#777";
theme.card.cardHeaderBackground = {
  default: "goldenrod",
  blue: "aquamarine",
  violet: "coral"
};

function ConnectButton() {
  
  const context = useWeb3React();
  const { connector, account, activate, deactivate, active, error } = context
  
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState(null)
  const [balance, setBalance] = React.useState(0);
  
  const { onPresentConnectModal } = useWalletModal(
    (name) => {
      try {
        const currentConnector = connectorsByName[name]
        setActivatingConnector(currentConnector)
        activate(connectorsByName[name])
        // console.log("------------------", name, currentConnector);
      } catch (error) {
        console.log(error);
      }
    }, 
    ()=>{onDisconnectClick()}
  )

  const getErrorMessage = useCallback(() => {
    if (error instanceof NoEthereumProviderError) {
      toast.dark( 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.');
    } else if (error instanceof UnsupportedChainIdError) {
      console.log( "You're connected to an unsupported network.");
    } else if (
      error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect||
      (typeof error == 'object'&&error.toString().includes("User closed modal"))
      // error instanceof UserRejectedRequestErrorFrame
    ) {
      if (connector===walletconnect) {
        connector.walletConnectProvider = null;
      }
        toast.dark( 'Please authorize this website to access your Ethereum account.');
    } else {
      toast.dark( 'An unknown error occurred. Check the console for more details.');
    }
  }, [error]);

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)
  
  // log the walletconnect URI
  useEffect(() => {
    const logURI = uri => {
      // console.log("WalletConnect URI", uri);
    };
    walletconnect.on(URI_AVAILABLE, logURI);

    injectStyle();

    return () => {
      walletconnect.off(URI_AVAILABLE, logURI);
    };
  }, []);

  const intialize = async () => {
    try {
      let balance = await getEthBalance(account);
      setBalance(balance);
    } catch(error) {
    }
  }
  

  useEffect(() => {
    intialize();
    const interval = setInterval(async () => {
      (async () => intialize())();
    }, 10000);
    
    return () => {
      clearInterval(interval);
    }
  }, [account]);

  useEffect(() => {
    if (context.error!==undefined)
    {
      getErrorMessage(context.error);
    }
  }, [context.error])

  const connectWalletButton = () => {
    return (
        <button onClick={onPresentConnectModal} type="button" className="btn btn-dark">
            Connect Wallet
        </button>
    )
  }

  const onDisconnectClick = () => {
    deactivate();
    if(connector===walletconnect)
      connector.walletConnectProvider=null;
  }

  const disconnectWalletButton = () => {
    // this is displayed after wallet is connected to site
    return (
        <div>
            <button type="button" className="mr-2 btn btn-dark">
                {(balance/1000000000000000000).toFixed(3)}
            </button>
            <Account />
            <button onClick={onDisconnectClick} type="button" className="btn btn-dark">
                Disconnect
            </button>
        </div>
    )
  }

  return (
    <>
      {!active ? connectWalletButton() : disconnectWalletButton()}
      <ToastContainer />
    </>
  )
}

function WalletButton() {
  return (
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <ConnectButton />
      </ModalProvider>
    </ThemeProvider>
  )
}

export default WalletButton = memo(WalletButton)