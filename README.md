# Shill me Solana Tokens 

A Node.js application for creating and managing tokens on the Solana blockchain. This project utilizes the Solana Agent Kit to facilitate token creation and management, including metadata handling through IPFS. (AI Gen)

## Features

- Create tokens with metadata
- Launch tokens with specified parameters
- Health check for Solana connection
- Image upload for token metadata

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in a `.env` file:
   ```plaintext
   WALLET_PRIVATE_KEY=<your-wallet-private-key>
   SOLANA_RPC_URL=<your-solana-rpc-url>
   ```

## Usage

`bash

npm start
`

To start the server, run:

### API Endpoints

- **Create Token**
  - **Endpoint:** `/create-token`
  - **Method:** `POST`
  - **Body:**
    ```json
    {
      "name": "Token Name",
      "symbol": "TOKEN",
      "description": "Token Description",
      "twitter": "https://twitter.com/token",
      "telegram": "https://t.me/token",
      "website": "https://token.com",
      "image": "<image-file>"
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "transaction": "<transaction-signature>",
      "explorer": "https://solscan.io/tx/<transaction-signature>"
    }
    ```

- **Launch PumpFun Token**
  - **Endpoint:** `/launch-pumpfun-token`
  - **Method:** `POST`
  - **Body:**
    ```json
    {
      "tokenName": "Token Name",
      "tokenTicker": "TOKEN",
      "description": "Token Description",
      "twitter": "https://twitter.com/token",
      "telegram": "https://t.me/token",
      "website": "https://token.com",
      "imageUrl": "<image-url>",
      "initialLiquiditySOL": 1.0,
      "mintAddress": "<mint-address>"
    }
    ```
  - **Response:**
    ```json
    {
      "success": true,
      "data": {
        "signature": "<transaction-signature>",
        "mint": "<mint-address>",
        "metadataUri": "<metadata-uri>"
      }
    }
    ```

- **Check Health**
  - **Endpoint:** `/health`
  - **Method:** `GET`
  - **Response:**
    ```json
    {
      "status": "connected"
    }
    ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Solana Agent Kit](https://github.com/sendaifun/solana-agent-kit) for providing the tools to interact with the Solana blockchain.
