import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// 1. Get projectId from environment variables
const projectId = import.meta.env.VITE_PROJECTID;

// 2. Define U2U Network Solaris Mainnet
const u2uSolarisMainnet = {
  id: 39,
  name: "U2U Solaris Mainnet",
  nativeCurrency: {
    name: "U2U",
    symbol: "U2U",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-mainnet.u2u.xyz"],
    },
    public: {
      http: ["https://rpc-mainnet.u2u.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "U2U Solaris Explorer",
      url: "https://u2uscan.xyz",
    },
  },
  testnet: false,
};

// 3. Network configuration
const networks = [u2uSolarisMainnet];

// 4. Create metadata object
const metadata = {
  name: "Usedy",
  description: "Decentralized application on U2U Solaris Mainnet",
  url: "http://localhost:5173",
  icons: ["./mark.svg"],
};

// 5. Create AppKit instance with U2U Solaris Mainnet
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true,
  },
  themeMode: "light", // or "dark"
  themeVariables: {
    "--w3m-accent": "#3B82F6", // Customize accent color
  },
});

// Export the network for use in other parts of your app
export { u2uSolarisMainnet };