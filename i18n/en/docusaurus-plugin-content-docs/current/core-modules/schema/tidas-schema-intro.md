---
sidebar_position: 1
---

# Introduction

TIDAS Schema is a lifecycle assessment (LCA) data standard framework built on JSON Schema, designed to enhance LCA data standardization, interoperability, and intelligent application potential. The TIDAS data structure is fully aligned with ILCD (International Life Cycle Data system) standards, preserving the complete prefix system used in ILCD XML format to enable lossless mapping of ILCD XML files.

Compared to traditional XML format used by ILCD, TIDAS adopts JSON structure which offers significant advantages in simplicity, readability, extensibility, and system integration capabilities. This design maintains compatibility with existing international data standards while making it easier to interface with modern digital infrastructure (such as blockchain systems, data spaces, AI engines, etc.), enhancing data mobility, intelligence, and trustworthiness.

> 👉 [Click here to download all **TIDAS** Json schema files from GitHub](https://github.com/tiangong-lca/tidas-tools/tree/main/src/tidas_tools/tidas/schemas)

## Technical Features

- **Based on JSON Schema Specification**  
  Uses JSON Schema to define field types, structural hierarchy and constraints, enabling structured validation and automated parsing for easier development and system integration.

- **Modular Architecture Design**  
  Schema is divided into multiple logical modules (17 total), supporting flexible invocation and rapid expansion to meet reuse requirements across various application scenarios.

- **Multi-language Validation Support**  
  Through universal JSON Schema validation mechanisms, it can be directly supported by multiple programming languages and validation engines, facilitating integration and application across different systems.

- **Detailed Error Diagnostics**  
  JSON Schema-based validation returns structured error information, improving debugging efficiency and ensuring data quality.

- **Enhanced Data Requirements**  
  Beyond lossless mapping of ILCD format, TIDAS Schema introduces additional content requirements from standards like EF (Environmental Footprint) and GLAD (Global LCA Data Access). For example, making certain fields mandatory enhances data completeness and exchangeability. Data satisfying TIDAS JSON Schema will inherently meet basic ILCD specifications, further ensuring international recognition and circulation of data.

> 👉 [Click here to download all **eILCD** schema and stylesheet files from GitHub](https://github.com/tiangong-lca/tidas-tools/tree/main/src/tidas_tools/eilcd)

## File Structure and Usage

TIDAS Schema consists of 17 core JSON Schema files, each describing a specific data module. For details, see [Data Structure (JSON Schema)](/docs/category/tidas-json-schema).

To learn how to use JSON Schema for data validation and format conversion, please refer to [Schema Validation](./tidas-schema-validation.md).
