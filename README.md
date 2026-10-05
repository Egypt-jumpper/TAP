# TaskMorph AI Power (TAP)

Production-oriented AI + Web3 platform on Sidra Chain.

## Implemented foundations

- Next.js + TypeScript + responsive dark-first UI.
- MetaMask is the primary wallet connector.
- WalletConnect is the secondary wallet picker when a real Project ID is configured.
- Sidra Chain network detection and live native-balance verification.
- Wallet-signature authentication with expiring nonces, atomic replay protection and signed HttpOnly sessions.
- Prisma/PostgreSQL data model for users, P2P ads/orders, authentication nonces and AI usage.
- P2P SDA/USDT model with external USDT networks; USDT is never treated as a Sidra-native token.
- Exact integer money arithmetic for SDA (18 decimals) and USDT (6 decimals); no floating-point settlement math.
- EVM USDT payment verification checks the configured USDT contract, transaction success, sender, recipient, Transfer event, amount and confirmations.
- Explicit P2P order state machine and serializable reservation/cancellation/expiry transactions.
- SDA escrow contract source with fee routing, dispute resolution and reentrancy protection.
- Escrow funding/mark-payment/release API transitions verify Sidra receipts and exact contract calldata before changing DB state.
- Server-side AI provider abstraction and authenticated chat endpoint; no fake AI response when credentials are missing.
- AI service catalog and usage ledger.
- CI workflow for Prisma generation, typecheck, tests, lint and production build.
- No private keys or seed phrases in the repository.

## Production configuration gates

Required before production:
- NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID for WalletConnect.
- DATABASE_URL for PostgreSQL.
- AUTH_SESSION_SECRET for wallet sessions.
- USDT_ETHEREUM_RPC_URL to enable Ethereum USDT verification.
- USDT_BSC_RPC_URL plus NEXT_PUBLIC_USDT_BSC_ADDRESS to enable BSC USDT verification.
- ESCROW_CONTRACT_ADDRESS after the escrow contract has actually been deployed and verified.
- NEXT_PUBLIC_SDA_TOKEN_ADDRESS and a verified Sidra DEX router address/ABI before enabling real swaps.
- AI_API_KEY and AI_API_URL before enabling AI generation.

TRON USDT is deliberately disabled until a real TRON verification adapter is implemented; the code does not claim unsupported verification.

## Verified public addresses

TAP token: 0x2b78034DBEA0cE70e662c9aA238db5CAF3CfE28F

Treasury: 0x8A783E73C086829bb4F478A45163D68D587a9378

Treasury is a public destination only. Never store or request its private key.

## Swap safety

Swap execution remains disabled until the exact Sidra DEX router contract and ABI are independently verified. The UI must not manufacture quotes, transaction hashes, gas values or token balances.

## P2P settlement architecture

SDA is escrowed on Sidra Chain. USDT is paid on its selected external network. The backend verifies the external USDT transfer before the escrow payment-marking/release flow proceeds. Off-chain payment methods are not represented as automatically verified blockchain transfers.

## Testing

Run: npm run db:generate, npm run typecheck, npm test, npm run lint, npm run build.
GitHub Actions runs the same verification sequence on pushes and pull requests.
