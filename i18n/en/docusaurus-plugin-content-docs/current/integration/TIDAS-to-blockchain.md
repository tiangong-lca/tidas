---
sidebar_position: 1
---

# TIDAS + Blockchain

A blockchain solution for LCA data built on the TIDAS architecture, enabling trusted lifecycle management from data collection to application:

Core technical mechanisms:

1. Standardized Data Anchoring
Encapsulates LCA data into blockchain-native objects compliant with ISO 22739 standard using TIDAS JSON Schema

2. Cross-Chain Verification Protocol
Adopts W3C Verifiable Credentials specification to ensure data interoperability across different blockchain platforms

3. Dynamic Storage Strategies
Supports chain storage modes based on data sensitivity:
    Full-chain storage: Core datasets on main chain
    Hybrid storage: Large files on IPFS with hash values on-chain
    Zero-knowledge proofs: Privacy data stores only verification evidence
