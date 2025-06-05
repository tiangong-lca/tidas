---
sidebar_position: 1
description: TIDAS与蚂蚁链集成的应用案例
---

# TIDAS 与蚂蚁链集成案例

## 🏗️ TIDAS与蚂蚁链集成概述

蚂蚁链提供了完整的区块链基础设施，通过[BaaS（区块链即服务）平台](https://antdigital.com/products/baas)与[数据可信协作平台](https://antdigital.com/products/tdsp)，支持多种区块链应用场景.

TIDAS 的数据结构可无缝集成蚂蚁链平台，目前已实现下述功能：

1. [**数据可信存证**](#-数据可信存证)：对企业上传的单元过程数据或碳足迹因子数据计算哈希并上链，实现数据不可篡改、全流程可追溯。
2. [**隐私安全计算**](#️-数据隐私计算)：实现多方在不暴露底层数据的前提下开展协同建模与统计分析，保障数据隐私与计算可信。

## 🔗 数据可信存证

TIDAS结合蚂蚁链，构建了一套数据防篡改与完整性验证解决方案。本文档介绍核心验证流程及实施细节，展示了如何利用区块链技术保障关键生产数据的可信度，可为企业数据管理、环境监管和碳排放核算提供技术支撑。

**核心流程**：

1. 原始数据哈希计算
2. 数据哈希上链存证
3. 本地存储交易凭证
4. 数据篡改验证

> **示例场景**：<br />某钢铁生产单元过程数据上传到天工平台（焦炭投入量13276.3428吨），计算数据哈希并通过蚂蚁链存证。当用户后续调用该数据时，可通过对比链上存储哈希和本地计算哈希验证数据是否被篡改，若数据被篡改（焦炭投入量数据改为13276.3427吨），经验证后可立即被发现。<br />**数据来源**：刘微. LCI数据质量体系中的分析方法研究. (北京工业大学, 2006)

### 🔄 数据验证与可信存证操作流程

#### 步骤一：原始数据哈希计算

TIDAS系统首先计算原始业务数据的哈希值，生成唯一的数据指纹。

**原始数据示例**:

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

**示例说明**：上述数据展示了TIDAS系统中的生产过程数据，包含指标值、数据来源等关键信息，这些数据将经过哈希计算，生成数据指纹用于后续的完整性验证。

**操作过程**：

1. TIDAS数据哈希值计算
2. SHA256哈希值: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c

> **技术说明**：系统采用SHA256哈希算法，相同数据生成相同哈希值，不同数据生成不同哈希值，且不可逆向推导原始数据。

#### 步骤二：数据哈希上链存证

将计算出的**数据哈希**写入蚂蚁链网络，获取区块链交易哈希作为存证凭证。

**操作过程**：

1. 系统登录并获取授权令牌  
   令牌: wsQR9eGcdUY22iVQKPQ4oIYrZaBDd18RO9KbWqFJW6aDxJpLTtUeQcO7hsqdqRP3FjYjY2N9QSe0QoL1C39YQDJ0F3R0QsYFyYO11imAxsLTanYe...（部分展示）

2. 将数据哈希发送至区块链  
   正在发送区块链写入请求...

3. 区块链确认并返回交易哈希  
   哈希成功写入区块链  
   交易哈希: 7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487

> **关键点**：交易哈希是区块链为此次存证生成的唯一标识，仅数据哈希被实际存储在链上。

#### 步骤三：本地存储交易凭证

系统将区块链返回的交易哈希安全存储，用于后续数据验证。

**存储信息示例**：

```json
{
  "blockNumber": 1414787,
  "transactionHash": "7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487",
  "timestamp": 1748811220199,
}
```

#### 步骤四：数据篡改验证

当需要验证数据是否被篡改时，系统执行以下验证流程：

**验证过程**：

1. 读取本地存储的交易哈希  
   交易哈希: 7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487  
   区块号: 1414787

2. 通过交易哈希从区块链查询原始存证哈希  
   从区块链查询交易数据...  
   服务器验证令牌: J3JsZW0zOTh3VTVTaVpWMFhVWjE3MTUyNzE3Y2Q0hVJyZjc3YTI5YzlibWhWapQYTmUyFiNTQyNGJjMDkzYw==  
   链上存储的原始数据哈希: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c

3. 计算当前数据哈希并与链上哈希比对

**验证结果**:

```bash
[验证成功] ✅
当前数据哈希: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c
链上存储哈希: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c
哈希值匹配，数据完整性得到确认。
```

> **验证原理**：若数据未被篡改，当前计算的哈希值应与链上存储的原始哈希值完全一致。

### 🔍 区块链浏览器查询

区块链浏览器提供交易记录的透明查询功能，可用于查看存证记录的确认状态。

**查询信息**：

```bash
交易ID: 7ebcb315ebcc9d27983316f83ba9a1ed916f3524e19fc3db392a254f738f487
区块高度: 1414787
交易时间: 2023-04-16 21:08:02
```

import TidasImage from '@site/src/components/TidasImage';

<TidasImage filename="Blockchain-explorer.png" />
<TidasImage filename="Blockchain-transaction-structure.png" />

### ⚠️ 数据篡改检测案例

当数据被篡改时，系统能够精确识别并预警。

**篡改示例**：

```diff
- "meanAmount": "13276.3428"
+ "meanAmount": "13276.3427"
```

**篡改后的数据**:

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

**验证结果**:

```bash
[验证失败] ❌
当前数据哈希: a6972e27120d3f77c11ca3719311c5e27aca3ab111906c42d7d56d1c4d12a9e
链上存储哈希: b9e5f69bca64c412e12175c417c4669bf4772a29c9efa6d7a3b21a5424bc093c

哈希值不匹配，检测到数据篡改!
```

> **说明**：即使只修改一个小数点后的数值，系统也能通过哈希比对精确检测到数据变更。篡改后的数据哈希值与区块链上存储的原始哈希不匹配，系统立即检测到篡改行为。

## 🛡️ 数据隐私计算

TIDAS结合蚂蚁链数据可信协作平台，构建了一套数据安全协同分析解决方案，本章节详细介绍了核心计算流程及实施细节，展示了如何在保护企业敏感数据的前提下，实现多方数据的安全协同分析。

**核心流程**：

1. 原始数据加密与接入
2. 任务创建与配置
3. 隐私计算执行
4. 获取计算结果

> **示例场景**：<br />研制行业数据时，需要对多家钢铁企业（计算案例为2家）的数据进行统计分析，通过蚂蚁链可信协作平台搭建隐私计算流程，在不暴露企业原始数据的前提下可获得计算结果。<br />**数据来源**：刘微. LCI数据质量体系中的分析方法研究. (北京工业大学, 2006)

### 🔄 多方数据安全协同分析操作流程

#### 步骤一：原始数据加密与接入

企业生产过程排放数据，通过API将数据接入可信协作节点，此过程在可信执行环境中进行，确保数据不会泄露。

**原始敏感数据示例 (节点 1)**:

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

**原始敏感数据示例 (节点 2)**:

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

#### 步骤二：任务创建与配置

在可信协作平台创建隐私计算任务，配置数据源及计算逻辑。

**操作过程**：

1. 系统标识需处理的敏感数据集

   ```bash
   🔑 节点 1 数据: {
     dataSetInternalID: '2',
     id: '2fbace5c-b2ff-4fd1-9162-04889ba12bca',
     version: '01.01.000'
   }
   🔑 节点 2 数据: {
     dataSetInternalID: '2',
     id: '07c8922f-151c-4013-813a-f9e7a20a7fbe',
     version: '01.01.000'
   }
   ```

2. 创建隐私计算任务  

   ```bash
   📋 任务创建结果:
   {
     "success": true,
     "instanceId": "INSTANCE_20250417165654_vbrqsYRj",
     "projectId": "PROJ_20250323163915_2nW3f7wz",
     "envId": "ENV_20250323163915_8EJkp60z",
     "appId": "APP_20250325165219_xdyRVNhu"
   }
   ```

> **技术说明**：系统将两个节点的敏感数据作为输入源，在可信执行环境中进行计算，各方不会看到对方的原始数据。

#### 步骤三：隐私计算执行

可信协作平台按设定逻辑执行计算任务。

**执行过程**：

1. 计算任务状态轮询

   ```bash
   📊 检查 #1 - 当前状态:
   {
     "success": true,
     "status": "INSTANCE_INSTANTIATED",
     "appInstanceStatus": "EXECUTING",
     "isComplete": false,
     "message": "Calculation is still in progress"
   }
   ⏳ 任务进行中，10秒后再次检查...
   ```

2. 计算任务完成  

   ```bash
   📊 检查 #10 - 当前状态:
   {
     "success": true,
     "status": "INSTANCE_COMPLETED",
     "coDatasetId": "CO_DATASET_20250417165657_UHAocMTS",
     "isComplete": true
   }
   ```

3. 计算总耗时  

   ```bash
   🕒 16:58:42 | ✅ 计算任务完成 | 耗时: 1分钟48秒
   ```

#### 步骤四：获取计算结果

计算完成后，系统安全地获取计算结果，结果数据不包含敏感信息。

**最终计算结果**：

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

**简化结果**:

```bash
[ 1.982 ]
```

> **结果说明**：通过可信协作平台，成功计算出两个节点粉尘排放数据的平均值为1.982，该结果可安全共享，不会泄露任何一方的原始敏感数据。

计算结果还可以进一步[存证上链](#-数据可信存证)，确保结果的可信性与不可篡改性。

### 🔍 可信协作平台平台可视化界面

可信协作平台提供直观的任务管理与监控界面，方便追踪计算过程与结果。

<TidasImage filename="PrivateCalculation-dashboard.png" />
<TidasImage filename="PrivateCalculation-result.png" />

### 🔐 数据隐私保护机制

数据可信协作平台采用多种技术确保数据安全性：

1. 安全多方计算 - 在可信执行环境中进行计算
2. 计算结果安全性验证 - 确保结果数据不包含敏感信息
3. 全程可追溯 - 记录计算过程的每一步操作

---

## 技术支持

<TidasImage filename="partners/ant-digital.svg" label="本集成方案由蚂蚁数字科技提供技术支持" width="200" />
