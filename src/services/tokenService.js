// src/services/tokenService.js
import { createTokenWithMetadata } from "../utils/solanaHelper.js";
import fs from "fs";
import fetch from "node-fetch";
import FormData from "form-data";

export const createTokenService = async ({
  imageFile,
  name,
  symbol,
  description,
  twitter,
  telegram,
  website,
}) => {
  try {
    // Create form data for metadata
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imageFile.path));
    formData.append("name", name);
    formData.append("symbol", symbol);
    formData.append("description", description);
    formData.append("twitter", twitter);
    formData.append("telegram", telegram);
    formData.append("website", website);
    formData.append("showName", "true");

    // Upload metadata to IPFS
    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
      method: "POST",
      body: formData,
    });

    
    const metadataResponseJSON = await metadataResponse.json();
    console.log("Metadata response JSON:", metadataResponseJSON);

    // Create token
    const result = await createTokenWithMetadata(metadataResponseJSON);
    console.log("Token creation result:", result);

    // Clean up uploaded file
    fs.unlinkSync(imageFile.path);

    return result;
  } catch (error) {
    throw new Error(`Token creation failed: ${error.message}`);
  }
};
