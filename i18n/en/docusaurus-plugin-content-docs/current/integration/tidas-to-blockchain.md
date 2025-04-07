---
sidebar_position: 1
---

# TIDAS + Blockchain

A blockchain solution for LCA data built on the TIDAS architecture, enabling trusted lifecycle management from data collection to application:

Core technical mechanisms:

1. Standardized Data Anchoring
Encapsulates LCA data as blockchain-native objects compliant with ISO 22739 standards using TIDAS JSON Schema

2. Cross-chain Verification Protocol
Adopts W3C Verifiable Credentials specification to ensure data interoperability across different blockchain platforms

3. Dynamic Storage Strategies
Supports chain storage modes based on data sensitivity:
    Full-chain storage: Core datasets stored on main chain
    Hybrid storage: Large files stored on IPFS with hashes on-chain
    Zero-knowledge proofs: Only verification evidence stored for private data
