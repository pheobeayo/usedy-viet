import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

// 1. Get projectId from environment variables
const projectId = import.meta.env.VITE_PROJECTID;

// 2. Define Ultra Nebula Testnet custom network
const ultraNebulaTestnet = {
  id: 2484,
  name: "Unicorn Ultra Nebula Testnet",
  nativeCurrency: {
    name: "U2U",
    symbol: "U2U",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-nebulas-testnet.uniultra.xyz"],
    },
    public: {
      http: ["https://rpc-nebulas-testnet.uniultra.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Ultra Nebula Testnet Explorer",
      url: "https://testnet.u2uscan.xyz",
    },
  },
  testnet: true,
};

// 3. Network configuration
const networks = [ultraNebulaTestnet];

// 4. Create metadata object
const metadata = {
  name: "Usedy",
  description: "Decentralized application on Ultra Nebula Testnet",
  url: "http://localhost:5173", 
  icons: ["./mark.svg"],
};

// 5. Create AppKit instance with custom network
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
export { ultraNebulaTestnet };