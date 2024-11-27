// src/controllers/tokenController.js
import { SolanaAgentKit } from "solana-agent-kit";
import {
  envSOLANA_RPC_URL,
  envWALLET_PRIVATE_KEY,
} from "../libs/globalEnvs.js";

// src/controllers/tokenController.js
import { createTokenService } from "../services/tokenService.js";
import { checkConnection } from "../utils/solanaHelper.js";

// Initialize SolanaAgentKit
const initSolanaKit = () => {
  if (!envWALLET_PRIVATE_KEY) {
    throw new Error("WALLET_PRIVATE_KEY is required in environment variables");
  }
  if (!envSOLANA_RPC_URL) {
    throw new Error("RPC_ENDPOINT is required in environment variables");
  }

  return new SolanaAgentKit(envWALLET_PRIVATE_KEY, envSOLANA_RPC_URL);
};

const solanaKit = initSolanaKit();

console.log("SolanaAgentKit initialized", solanaKit);

export const launchPumpFunTokenHandler = async (req, res) => {
  try {
    const {
      tokenName,
      tokenTicker,
      description,
      twitter,
      telegram,
      website,
      imageUrl,
      initialLiquiditySOL,
      mintAddress,
    } = req.body;

    if (!tokenName || !tokenTicker) {
      return res.status(400).json({
        error: "Token name and ticker are required",
      });
    }

    console.log("Launching token with params:", {
      tokenName,
      tokenTicker,
      description,
      initialLiquiditySOL,
    });

    const result = await solanaKit.launchpumpfuntoken(tokenName, tokenTicker, {
      description,
      twitter,
      telegram,
      website,
      imageUrl,
      initialLiquiditySOL,
      mintAddress,
    });

    res.json({
      success: true,
      data: {
        signature: result.signature,
        mint: result.mint,
        metadataUri: result.metadataUri,
      },
    });
  } catch (error) {
    console.error("Error launching PumpFun token:", error);
    res.status(500).json({
      error: error.message || "Failed to launch token",
    });
  }
};

export const checkHealth = async (req, res) => {
  try {
    const connectionStatus = await checkConnection();
    res.json(connectionStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createToken = async (req, res) => {
  try {
    // Check connection before proceeding
    const connectionStatus = await checkConnection();
    if (connectionStatus.status !== "connected") {
      throw new Error("Solana connection is not available");
    }

    const { name, symbol, description, twitter, telegram, website } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const result = await createTokenService({
      imageFile,
      name,
      symbol,
      description,
      twitter,
      telegram,
      website,
    });

    res.json({
      success: true,
      transaction: result.signature,
      explorer: `https://solscan.io/tx/${result.signature}`,
    });
  } catch (error) {
    console.error("Error creating token:", error);
    res.status(500).json({ error: error.message });
  }
};
