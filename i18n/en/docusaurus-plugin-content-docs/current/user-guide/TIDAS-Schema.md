---
sidebar_position: 1
---

# TIDAS Schema Configuration

Welcome to this guide! This guide will help you understand how to configure TIDAS Schema.

## Introduction to TIDAS Schema

TIDAS Schema is a JSON-based schema validation that ensures data structure standardization. TIDAS schema consists of the following components:

- **`data_types.json`**: Contains basic data types for lifecycle data, including data type names, descriptions, units, etc.
- **`tidas_classification_category.json`**: Defines structural information for various "classification levels" or "classification standards" in LCA data. Typically used for classifying objects like Processes or Flows.
- **`tidas_contacts.json`**: Maintains contact information related to LCA data, such as researchers, data providers, reviewers, etc.
- **`tidas_flowproperties.json`**: Contains flow properties for lifecycle data, including property names, descriptions, units, etc.
- **`tidas_flows_elementary_category.json`**: Contains elementary flow classifications for lifecycle data, including classification names, descriptions, etc.
- **`tidas_flows_product_category.json`**: Contains product flow classifications for lifecycle data, including product category names, descriptions, etc.
- **`tidas_flow.json`**: Contains flow information for lifecycle data, including flow names, descriptions, properties, etc.
- **`tidas_lciamethods.json`**: Contains LCIA methods for lifecycle data, including method names, descriptions, units, etc.
- **`tidas_lifecyclemodels.json`**: Contains lifecycle models for lifecycle data, including model names, descriptions, etc.
- **`tidas_locations_category.json`**: Contains location information for lifecycle data, including location names, descriptions, etc.
- **`tidas_process_category.json`**: Contains unit process classifications for lifecycle data, including classification names, descriptions, etc.
- **`tidas_process.json`**: Contains unit processes for lifecycle data, including process names, descriptions, input/output flows, etc.
- **`tidas_sources.json`**: Contains data sources for lifecycle data, including source names, descriptions, etc.
- **`tidas_unitgroups.json`**: Contains unit groups for lifecycle data, including group names, descriptions, units, etc.

For detailed content, please refer to [TIDAS Schema](/docs/user-guide/json-schema)

## TIDAS Schema Use Cases

TIDAS Schema is mainly used in the following scenarios:

- Format validation during data exchange and sharing
- Data quality control and completeness checking
- Data modeling and system integration
- Data standardization and interoperability

## Schema Validation Rules

TIDAS Schema includes the following validation rules:

1. Data type validation: Ensures field values conform to defined data types
2. Required field validation: Checks if all required fields are filled
3. Value range validation: Verifies if field values are within allowed ranges
4. Reference integrity validation: Checks if object references are correct
5. Business rule validation: Executes domain-specific business logic validation

## Schema Version Management

TIDAS Schema uses Semantic Versioning (SemVer):

- Major version: Incompatible API changes
- Minor version: Backward-compatible feature additions
- Patch version: Backward-compatible bug fixes

## Schema Extension and Customization

Users can extend the Schema through the following methods:

1. Adding custom fields
2. Defining new data types
3. Creating new classification systems
4. Extending validation rules

## How to Use Schema Files
