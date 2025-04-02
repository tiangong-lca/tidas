---
sidebar_position: 2
---

# Quick Start

## Industrial Implementation of TIDAS Architecture - [TianGong LCA Platform](https://docs.tiangong.earth/)

As the first open-source implementation of TIDAS (TIangong DAta System) architecture, provides a complete LCA solution compliant with international standards:

- **Architecture Integrity**: 100% implements TIDAS data architecture and API specifications, validated in industrial scenarios
- **Hybrid Deployment**: Supports cloud SaaS services and enterprise on-premise deployment
- **Distributed Collaboration**: Cross-organization project management system based on RBAC permission model
- **Ecosystem Hub**: Aggregates 70+ industry TIDAS standard datasets globally

# Technical Integration & Extensions

## TIDAS with Blockchain
Blockchain anchoring technology for trusted LCA data storage:
- **[TIDAS Blockchain Solution](./integration/TIDAS-to-blockchain.md)**  
  Provides cross-chain data package standards (including IPFS hash anchoring) and smart contract template library

- **[ANTCHAIN Integration](./use_case/TIDAS-to-ANTCHAIN.md)**  
  Light node verification framework based on TIDAS JSON Schema, with enterprise BaaS services

- **[Hyperledger Adaptation Guide](./use_case/TIDAS-to-Hyperledger.md)**  
  Privacy-enhanced implementation for consortium chain scenarios

## TIDAS with LCA Analysis Tools

Plug-and-play integration with LCA software:
- **[Haike Data](./use_case/block_builder.md)**  
  Supports one-click import of TIDAS datasets and model mapping configuration
- *(In Development) openLCA Integration* 
- *(In Development) SimaPro Integration*
- *(In Development) Brightway Integration* 

## TIDAS with AI
*(In Development) MCP Server*
*(In Development) LLM-based LCA data validation and scenario generation framework*

# Developer Guide

## TIDAS Data Model
Extensible data architecture based on JSON Schema:
- [Schema Documentation](/docs/schema/TIDAS-Schema.md)  

## Development Toolbox
TIDAS provides development tools for easier data validation and conversion:
- **Schema Validation**: CLI/GUI dual-mode validation with custom rule injection
- **Format Conversion**: Supports eILCD format conversion
- **TIDAS Export Tool**: For exporting TIDAS data to integrate with other systems

## Database Construction Guidelines
TIDAS follows [LCA/Carbon Footprint Database Guidelines](https://www.carbonfootprint.network/docs/category/lca-database-guideline). Users can develop their own LCA databases by combining these guidelines with TIDAS JSON Schema.

# Community Collaboration
- TIDAS Development: See [Developer Documentation](/docs/how-to-contribut-tidas-doc.md)
- Issue Reporting: 🐞 [Bug Reports](https://github.com/tiangong-lca/tidas/issues)  
- Enterprise Partner Program: *(In Development) Custom technical support channel*
- Commercial Support: contact@tiangong.earth (for SLA-guaranteed services)
