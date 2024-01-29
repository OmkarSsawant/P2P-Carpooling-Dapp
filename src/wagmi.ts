import { http, createConfig } from 'wagmi'
import { hardhat, localhost} from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [hardhat],
  connectors: [
    injected(),
    // coinbaseWallet({ appName: 'Create Wagmi' }),
    // walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
  ],
  ssr: true,
  transports: {
    [hardhat.id]: http(),
    [localhost.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
