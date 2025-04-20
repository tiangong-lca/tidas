---
sidebar_position: 1
description: Detailed case study on how TIDAS data system integrates with and uses AntChain
---

# TIDAS Application Case on AntChain

## 🏗️ Overview of TIDAS and AntChain Integration

AntChain provides a complete blockchain infrastructure through its [BaaS (Blockchain as a Service) platform](https://antdigital.com/products/baas) and [Trusted Data Sharing Platform](https://antdigital.com/products/tdsp), supporting various blockchain application scenarios.

TIDAS data structures can be seamlessly integrated with the AntChain platform, currently enabling the following functionalities:

1. [**Trusted Data Certification**](#-trusted-data-certification): Calculates and stores hashes of unit process data or carbon footprint factor data uploaded by enterprises onto the blockchain, ensuring data immutability and full process traceability.
2. [**Privacy-Preserving Computation**](#-privacy-preserving-computation): Enables multi-party collaborative modeling and statistical analysis without exposing underlying data, ensuring data privacy and computation trustworthiness.

## 🔗 Trusted Data Certification

TIDAS, in combination with AntChain, has built a data tampering prevention and integrity verification solution. This document introduces the core verification process and implementation details, demonstrating how blockchain technology can be used to ensure the trustworthiness of key production data, providing technical support for enterprise data management, environmental monitoring, and carbon emission accounting.

**Core Process**:

1. Original data hash calculation
2. Data hash on-chain certification
3. Local storage of transaction credentials
4. Data tampering verification

> **Example Scenario**:<br />Unit process data from a steel production facility is uploaded to the TIDAS platform (coke input of 13276.3428 tons), the data hash is calculated and certified through AntChain. When users subsequently access this data, they can verify whether the data has been tampered with by comparing the on-chain stored hash with the locally calculated hash. If the data is tampered with (coke input data changed to 13276.3427 tons), it can be immediately detected through verification.<br />**Data Source**: Liu Wei. Research on Analytical Methods in LCI Data Quality System. (Beijing University of Technology, 2006)(Chinese)

### 🔄 Data Verification and Trusted Certification Operation Process

#### Step 1: Original Data Hash Calculation

The TIDAS system first calculates the hash value of the original business data, generating a unique data fingerprint.

**Original Data Example**:

```json
{
  "processDataSet": {
    "xmlns": "http://icm.jrc.it/ILCD/Process",
    "version": "1.1",
    "exchange": [
      {
        "meanAmount": "489.0",
        "generalComment": {
          "text": "Coal injection",
          "xml:lang": "en"
        },
        "text": "喷煤",
        "xml:lang": "zh"
      },
      {
        "resultingAmount": "489.0",
        "exchangeDirection": "Input",
        "dataSetInternalID": "0",
        "referenceToFlowDataSet": {
          "uri": "../flows/b905fbda-65fa-4a8b-b19e-37f87ee2bef9.xml",
          "type": "flow data set",
          "version": "01.01.000",
          "refObjectId": "b905fbda-65fa-4a8b-b19e-37f87ee2bef9",
          "commonShortDescription": {
            "text": "coke; coking; production mix in the coking plant; 28.435 MJ/kg net heating value",
            "xml:lang": "en"
          },
          "text": "焦炭; 炼焦; 生产混合; 在炼化厂; 28.435 MJ/kg 净热值",
          "xml:lang": "zh"
        },
        "dataDerivationTypeStatus": "Measured",
        "meanAmount": "13276.3428"
      }
    ]
  }
}
```

**Example Explanation**: The above data shows production process data in the TIDAS system, including indicator values, data sources, and other key information. This data will go through hash calculation to generate a data fingerprint for subsequent integrity verification.

**Operation Process**:

1. TIDAS data hash value calculation
2. SHA256 hash value: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c

> **Technical Note**: The system uses the SHA256 hash algorithm, which generates the same hash value for identical data, different hash values for different data, and cannot be reverse-engineered to derive the original data.

#### Step 2: Data Hash On-Chain Certification

Write the calculated **data hash** to the AntChain network and obtain a blockchain transaction hash as certification credentials.

**Operation Process**:

1. System login and token authorization  
   Token: wsQR9eGcdUY22iVQKPQ4oIYrZaBDd18RO9KbWqFJW6aDxJpLTtUeQcO7hsqdqRP3FjYjY2N9QSe0QoL1C39YQDJ0F3R0QsYFyYO11imAxsLTanYe... (partially displayed)

2. Send data hash to the blockchain  
   Sending blockchain write request...

3. Blockchain confirmation and transaction hash return  
   Hash successfully written to blockchain  
   Transaction hash: 7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487

> **Key Point**: The transaction hash is a unique identifier generated by the blockchain for this certification, with only the data hash actually stored on-chain.

#### Step 3: Local Storage of Transaction Credentials

The system securely stores the transaction hash returned by the blockchain for subsequent data verification.

**Stored Information Example**:

```json
{
  "blockNumber": 1414787,
  "transactionHash": "7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487",
  "timestamp": 1748811220199,
}
```

#### Step 4: Data Tampering Verification

When needing to verify whether data has been tampered with, the system executes the following verification process:

**Verification Process**:

1. Read locally stored transaction hash  
   Transaction hash: 7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487  
   Block number: 1414787

2. Query original certification hash from blockchain using transaction hash  
   Querying transaction data from blockchain...  
   Server verification token: J3JsZW0zOTh3VTVTaVpWMFhVWjE3MTUyNzE3Y2Q0hVJyZjc3YTI5YzlibWhWapQYTmUyFiNTQyNGJjMDkzYw==  
   Original data hash stored on-chain: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c

3. Calculate current data hash and compare with on-chain hash

**Verification Result**:

```bash
[Verification Successful] ✅
Current data hash: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c
On-chain stored hash: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c
Hash values match, data integrity is confirmed.
```

> **Verification Principle**: If the data has not been tampered with, the currently calculated hash value should be identical to the original hash value stored on-chain.

### 🔍 Blockchain Explorer Query

The blockchain explorer provides transparent query functionality for transaction records, which can be used to view the confirmation status of certification records.

**Query Information**:

```bash
Transaction ID: 7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487
Block Height: 1414787
Transaction Time: 2023-04-16 21:08:02
```

import TidasImage from '@site/src/components/TidasImage';

<TidasImage filename="Blockchain-explorer.png" />
<TidasImage filename="Blockchain-transaction-structure.png" />

### ⚠️ Data Tampering Detection Case

When data is tampered with, the system can precisely identify and alert.

**Tampering Example**:

```diff
- "meanAmount": "13276.3428"
+ "meanAmount": "13276.3427"
```

**Tampered Data**:

```json
{
  "processDataSet": {
    "xmlns": "http://icm.jrc.it/ILCD/Process",
    "version": "1.1",
    "exchange": [
      {
        "meanAmount": "489.0",
        "generalComment": {
          "text": "Coal injection",
          "xml:lang": "en"
        },
        "text": "喷煤",
        "xml:lang": "zh"
      },
      {
        "resultingAmount": "489.0",
        "exchangeDirection": "Input",
        "dataSetInternalID": "0",
        "referenceToFlowDataSet": {
          "uri": "../flows/b905fbda-65fa-4a8b-b19e-37f87ee2bef9.xml",
          "type": "flow data set",
          "version": "01.01.000",
          "refObjectId": "b905fbda-65fa-4a8b-b19e-37f87ee2bef9",
          "commonShortDescription": {
            "text": "coke; coking; production mix in the coking plant; 28.435 MJ/kg net heating value",
            "xml:lang": "en"
          },
          "text": "焦炭; 炼焦; 生产混合; 在炼化厂; 28.435 MJ/kg 净热值",
          "xml:lang": "zh"
        },
        "dataDerivationTypeStatus": "Measured",
        "meanAmount": "13276.3427"
      }
    ]
  }
}
```

**Verification Result**:

```bash
[Verification Failed] ❌
Current data hash: a6972e27120d3f77c11ca3719311c5e27aca3ab111906c42d7d56d1c4d12a9e
On-chain stored hash: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c

Hash values do not match, data tampering detected!
```

> **Note**: Even if only a value after the decimal point is modified, the system can precisely detect data changes through hash comparison. The hash value of the tampered data does not match the original hash stored on the blockchain, and the system immediately detects the tampering behavior.

## 🛡️ Privacy-Preserving Computation

TIDAS, in combination with AntChain's Trusted Data Sharing Platform, has built a secure collaborative data analysis solution. This section provides detailed information on the core computation process and implementation details, demonstrating how secure collaborative analysis of multi-party data can be achieved while protecting sensitive enterprise data.

**Core Process**:

1. Original data encryption and access
2. Task creation and configuration
3. Privacy-preserving computation execution
4. Obtaining computation results

> **Example Scenario**:<br />When developing industry data, statistical analysis of data from multiple steel enterprises (2 companies in this case example) is required. Through AntChain's Trusted Collaboration Platform, a privacy-preserving computation process is established to obtain calculation results without exposing the enterprises' original data.<br />**Data Source**: Liu Wei. Research on Analytical Methods in LCI Data Quality System. (Beijing University of Technology, 2006)(Chinese)

### 🔄 Multi-Party Data Secure Collaborative Analysis Operation Process

#### Step 1: Original Data Encryption and Access

Enterprise production process emission data is accessed through API to trusted collaboration nodes. This process takes place in a trusted execution environment, ensuring that data will not be leaked.

**Original Sensitive Data Example (Node 1)**:

```json
{
  "resultingAmount": "2.197",
  "exchangeDirection": "Output",
  "@dataSetInternalID": "2",
  "referenceToFlowDataSet": {
    "@uri": "../flows/f097a1b3-17d6-4dc5-a2be-642dbf1517e3.xml",
    "@type": "flow data set",
    "@version": "01.01.000",
    "@refObjectId": "f097a1b3-17d6-4dc5-a2be-642dbf1517e3",
    "common:shortDescription": [
      {
        "#text": "粉尘; 钢铁生产原料投料; 生产混合，在工厂; 粒径范围0.5~5μm",
        "@xml:lang": "zh"
      },
      {
        "#text": "dust; Raw materials feeding for steel production; Production mixing, in the factory; The particle size range is 0.5 - 5 μm.",
        "@xml:lang": "en"
      }
    ]
  },
  "dataDerivationTypeStatus": "Measured"
}
```

**Original Sensitive Data Example (Node 2)**:

```json
{
  "meanAmount": "1.767",
  "resultingAmount": "1.767",
  "exchangeDirection": "Output",
  "@dataSetInternalID": "2",
  "referenceToFlowDataSet": {
    "@uri": "../flows/f097a1b3-17d6-4dc5-a2be-642dbf1517e3.xml",
    "@type": "flow data set",
    "@version": "01.01.000",
    "@refObjectId": "f097a1b3-17d6-4dc5-a2be-642dbf1517e3",
    "common:shortDescription": [
      {
        "#text": "粉尘; 钢铁生产原料投料; 生产混合，在工厂; 粒径范围0.5~5μm",
        "@xml:lang": "zh"
      },
      {
        "#text": "dust; Raw materials feeding for steel production; Production mixing, in the factory; The particle size range is 0.5 - 5 μm.",
        "@xml:lang": "en"
      }
    ]
  },
  "dataDerivationTypeStatus": "Measured"
}
```

#### Step 2: Task Creation and Configuration

Create a privacy-preserving computation task on the trusted collaboration platform, configuring data sources and computation logic.

**Operation Process**:

1. System identifies sensitive datasets to be processed

   ```bash
   🔑 Node 1 Data: {
     dataSetInternalID: '2',
     id: '2fbace5c-b2ff-4fd1-9162-04889ba12bca',
     version: '01.01.000'
   }
   🔑 Node 2 Data: {
     dataSetInternalID: '2',
     id: '07c8922f-151c-4013-813a-f9e7a20a7fbe',
     version: '01.01.000'
   }
   ```

2. Create privacy-preserving computation task  

   ```bash
   📋 Task Creation Result:
   {
     "success": true,
     "instanceId": "INSTANCE_20250417165654_vbrqsYRj",
     "projectId": "PROJ_20250323163915_2nW3f7wz",
     "envId": "ENV_20250323163915_8EJkp60z",
     "appId": "APP_20250325165219_xdyRVNhu"
   }
   ```

> **Technical Note**: The system uses sensitive data from two nodes as input sources for computation in a trusted execution environment. Parties will not see each other's original data.

#### Step 3: Privacy-Preserving Computation Execution

The trusted collaboration platform executes the computation task according to the set logic.

**Execution Process**:

1. Computation task status polling

   ```bash
   📊 Check #1 - Current Status:
   {
     "success": true,
     "status": "INSTANCE_INSTANTIATED",
     "appInstanceStatus": "EXECUTING",
     "isComplete": false,
     "message": "Calculation is still in progress"
   }
   ⏳ Task in progress, checking again in 10 seconds...
   ```

2. Computation task completion  

   ```bash
   📊 Check #10 - Current Status:
   {
     "success": true,
     "status": "INSTANCE_COMPLETED",
     "coDatasetId": "CO_DATASET_20250417165657_UHAocMTS",
     "isComplete": true
   }
   ```

3. Total computation time  

   ```bash
   🕒 16:58:42 | ✅ Computation task completed | Time spent: 1 minute 48 seconds
   ```

#### Step 4: Obtaining Computation Results

After computation is completed, the system securely obtains the computation results, which do not contain sensitive information.

**Final Computation Results**:

```json
{
  "success": true,
  "data": [
    {
      "name": "average_value",
      "type": "DOUBLE",
      "valueList": [
        1.982
      ]
    }
  ]
}
```

**Simplified Result**:

```bash
[ 1.982 ]
```

> **Result Explanation**: Through the trusted collaboration platform, the average value of dust emission data from two nodes was successfully calculated as 1.982. This result can be safely shared without leaking any party's original sensitive data.

The computation results can be further [certified on-chain](#-trusted-data-certification) to ensure the trustworthiness and immutability of the results.

### 🔍 Trusted Collaboration Platform Visualization Interface

The trusted collaboration platform provides an intuitive task management and monitoring interface, facilitating tracking of the computation process and results.

<TidasImage filename="PrivateCalculation-dashboard.png" />
<TidasImage filename="PrivateCalculation-result.png" />

### 🔐 Data Privacy Protection Mechanism

The Trusted Data Sharing Platform employs multiple technologies to ensure data security:

1. Secure Multi-party Computation - Computation performed in a trusted execution environment
2. Computation Result Security Verification - Ensuring result data does not contain sensitive information
3. Full Process Traceability - Recording every step of the computation process
