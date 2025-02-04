# Signing Tool for Ledger

## Overview

The **Signing Tool for Ledger** is a tool designed to generate cryptographic signatures required for claiming funds through a claim portal. Users can input specific details, and the tool outputs a valid signature for the claim message.

### Features

- **Private Key Input**:
  - Accepts private keys in **WIF format** or **HEX format**.
  - Allows specifying whether the private key uses the **compressed** or **uncompressed** setting, ensuring compatibility with early ZEN wallets that used uncompressed public keys.
- **Signature Generation**:
  - Inputs: Private key and destination address.
  - Output: A valid signature for the claim message, ready to be used on the claim portal.

### Technical Details

- Built with **Next.js** and **TypeScript**.
- The project output uses **static HTML, CSS, and JavaScript files**, allowing the tool to run completely offline. This ensures that sensitive operations, such as handling private keys, remain secure and confined to the user's local environment.
  - Learn more about static exports here: [Next.js Static Exports Documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports).

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/signing-tool.git
   cd signing-tool
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Build

1. Build the project:

   ```bash
   npm run build
   ```

The static files will be available in the out directory.
Open the index.html file in your browser to run the tool.
