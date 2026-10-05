# TaskMorph AI Power (TAP)

Production-oriented foundation for an AI + Web3 platform on Sidra Chain.

## Current foundation
- Next.js + TypeScript application
- Dark-first responsive UI
- Swap and P2P route foundations
- Centralized Web3 configuration
- Treasury wallet kept separate from token contract configuration
- No private keys or seed phrases in the repository

## Critical production rule
Do not invent Sidra Chain, TAP, SDA, USDT or DEX contract addresses. Populate .env.local only after verifying official/on-chain addresses.

Treasury wallet configured by default:
0x8A783E73C086829bb4F478A45163D68D587a9378

This is a public wallet address only. Never store a private key or seed phrase.

## Next implementation layers
1. Verified Sidra chain/token/DEX configuration and wallet connection.
2. Real quote/approval/swap transaction flow.
3. P2P escrow contracts and marketplace backend.
4. AI chat/services with secure server-side provider integration.
5. Database, authentication, transaction indexing, disputes and admin.
6. Tests, CI and deployment.
