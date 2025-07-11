"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network, Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
} from "react";

type WalletContextType = {
  address: string | null;
  connectWallet: () => Promise<void>;
  account: any;
};

const WalletContext = createContext<WalletContextType>({
  address: null,
  connectWallet: async () => {},
  account: null,
});

const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

export const WalletProvider = ({ children }: PropsWithChildren) => {
  const [address, setAddress] = useState<string | null>(null);
  const [account, setAccount] = useState(null);

  const connectWallet = useCallback(async () => {
    if (!window.aptos) {
      alert("Petra wallet not found. Please install it.");
      return;
    }

    try {
      const result = await window.aptos.connect();
      setAccount(result);
      setAddress(result.address);
    } catch (e: any) {
      console.error("Wallet connect error:", e.message);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (window.aptos && window.aptos.isConnected) {
        const account = await window.aptos.account();
        setAccount(account);
        setAddress(account.address);
      }
    })();
  }, []);

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: Network.TESTNET }}
    >
      <WalletContext.Provider value={{ address, connectWallet, account }}>
        {children}
      </WalletContext.Provider>
    </AptosWalletAdapterProvider>
  );
};

export const useAptosWallet = () => useContext(WalletContext);
