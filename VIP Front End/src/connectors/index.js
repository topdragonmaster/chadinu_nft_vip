import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { chainId, rpcUrl } from 'constants/config'

const POLLING_INTERVAL = 12000
const RPC_URLS = {
  1: rpcUrl,
}

export const injected = new InjectedConnector({ supportedChainIds: [chainId] })

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[chainId] },
  defaultChainId: 1
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1:RPC_URLS[chainId] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[chainId],
  appName: 'Chadinu'
})
