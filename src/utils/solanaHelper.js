// src/utils/solanaHelper.js
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import fetch from "node-fetch";
import {
  envSOLANA_RPC_URL,
  envWALLET_PRIVATE_KEY,
  envWALLET_PUBLIC_KEY,
} from "../libs/globalEnvs.js";

// Validate RPC endpoint
const validateRPCEndpoint = (endpoint) => {
  if (!endpoint) {
    throw new Error("RPC_ENDPOINT is not defined in environment variables");
  }

  if (!endpoint.startsWith("http://") && !endpoint.startsWith("https://")) {
    throw new Error("RPC_ENDPOINT must start with http:// or https://");
  }

  return endpoint;
};

// Initialize Solana connection with validation
const initializeSolanaConnection = () => {
  const endpoint = validateRPCEndpoint(envSOLANA_RPC_URL);

  try {
    return new Connection(endpoint, "confirmed");
  } catch (error) {
    throw new Error(`Failed to initialize Solana connection: ${error.message}`);
  }
};

// Initialize connection with error handling
const web3Connection = initializeSolanaConnection();

export const createTokenWithMetadata = async (metadataResponse) => {
  try {
    // Validate private key
    if (!envWALLET_PRIVATE_KEY) {
      throw new Error(
        "WALLET_PRIVATE_KEY is not defined in environment variables"
      );
    }

    // Validate public key
    if (!envWALLET_PUBLIC_KEY) {
      throw new Error(
        "WALLET_PUBLIC_KEY is not defined in environment variables"
      );
    }

    const signerKeyPair = Keypair.fromSecretKey(
      bs58.decode(envWALLET_PRIVATE_KEY)
    );
    const mintKeypair = Keypair.generate();
    console.log("Mint keypair:", mintKeypair);
    console.log("Mint public key:", mintKeypair.publicKey.toBase58());

    const response = await fetch("https://pumpportal.fun/api/trade-local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey: envWALLET_PUBLIC_KEY,
        action: "create",
        tokenMetadata: {
          name: metadataResponse.metadata.name,
          symbol: metadataResponse.metadata.symbol,
          uri: metadataResponse.metadataUri,
        },
        mint: mintKeypair.publicKey.toBase58(),
        denominatedInSol: "true",
        amount: 0.0001,
        slippage: 5,
        priorityFee: 0.00005,
        pool: "pump",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Transaction creation failed: ${response.status} - ${errorText}`
      );
    }

    const data = await response.arrayBuffer();
    const tx = VersionedTransaction.deserialize(new Uint8Array(data));
    tx.sign([mintKeypair, signerKeyPair]);

    const signature = await web3Connection.sendTransaction(tx);
    return { signature };
  } catch (error) {
    console.error("Error in createTokenWithMetadata:", error);
    throw new Error(`Token creation failed: ${error.message}`);
  }
};

// Add a health check function to verify connection
export const checkConnection = async () => {
  try {
    const version = await web3Connection.getVersion();
    return {
      status: "connected",
      version: version["solana-core"],
    };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
    };
  }
};
