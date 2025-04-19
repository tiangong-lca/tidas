---
sidebar_position: 3
description: TIDAS数据系统基于隐私计算的敏感数据安全协同分析实践
---

# TIDAS数据隐私计算解决方案

## 📋 方案概述

TIDAS结合隐私计算平台，构建了一套数据安全协同分析解决方案。本文档介绍核心计算流程及实施细节。

**核心流程**：

1. 原始敏感数据集准备
2. 数据加密授权上传
3. 隐私计算任务创建与执行
4. 安全获取计算结果

## 🔄 隐私计算完整流程

### 步骤一：原始敏感数据准备

TIDAS系统中包含多方敏感数据，这些数据直接共享可能导致隐私泄露，但通过隐私计算平台可实现安全协同分析。

**原始敏感数据示例 (节点 1)**:

```json
{
  "acudAmount": "1.707",
  "acudUnit": "t/h",
  "exchangeDirection": "Output",
  "entrySetInternalID": "2",
  "referenceTagInDataSet": {
    "href": "../flows/f097a1b3-17d6-4dc5-a2be-642dbff317e7.xml",
    "type": "flow data set",
    "version": "01.01.000",
    "refObjectId": "f097a1b3-17d6-4dc5-a2be-642dbff317e7",
    "commonShortDescription": [
      {
        "text": "粉尘; 钢铁生产原料投料; 生产混合, 在工厂; 粒径范围0.5-5μm",
        "lang": "zh"
      },
      {
        "text": "dust; Raw materials feeding for steel production; Production mixing, In the factory; The particle size range is 0.5 - 5 μm.",
        "lang": "en"
      }
    ]
  },
  "dataDerivationTypeStatus": "Measured"
}
```

**原始敏感数据示例 (节点 2)**:

```json
{
  "resultingAmount": "1.197",
  "exchangeDirection": "Output",
  "referenceTagInDataSet": {
    "href": "../flows/f097a1b3-17d6-4dc5-a2be-642dbff317e7.xml",
    "type": "flow data set",
    "version": "01.01.000",
    "refObjectId": "f097a1b3-17d6-4dc5-a2be-642dbff317e7",
    "commonShortDescription": [
      {
        "text": "粉尘; 钢铁生产原料投料; 生产混合, 在工厂; 粒径范围0.5-5μm",
        "lang": "zh"
      },
      {
        "text": "dust; Raw materials feeding for steel production; Production mixing, In the factory; The particle size range is 0.5 - 5 μm.",
        "lang": "en"
      }
    ]
  },
  "dataDerivationTypeStatus": "Measured"
}
```

**示例说明**：上述数据展示了不同节点采集的钢铁生产过程中的粉尘排放数据，这些敏感数据直接共享可能存在商业机密泄露风险，但需要进行协同分析计算平均值用于行业基准参考。

### 步骤二：隐私计算任务创建

在隐私计算平台创建计算任务，配置数据源及计算逻辑。

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

> **技术说明**：系统将两个节点的敏感数据作为输入源，隐私计算平台会在数据加密状态下进行计算，各方不会看到对方的原始数据。

### 步骤三：安全计算执行过程

隐私计算平台按设定逻辑执行计算任务，全程数据保持加密状态。

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
   ==================================================
   🕒 16:58:42 | ✅ 计算任务完成 | 耗时: 1分钟48秒
   ==================================================
   ```

> **关键点**：整个计算过程在加密环境中执行，各方无法获取对方的原始数据，确保数据安全性。

### 步骤四：获取计算结果

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
        1.981949
      ]
    }
  ]
}
```

**简化结果**:

```bash
[
  1.981949
]
```

> **结果说明**：通过隐私计算平台，成功计算出两个节点粉尘排放数据的平均值为1.981949，该结果可安全共享，不会泄露任何一方的原始敏感数据。

## 🔍 隐私计算平台可视化界面

隐私计算平台提供直观的任务管理与监控界面，方便追踪计算过程与结果。

import TidasImage from '@site/src/components/TidasImage';

<TidasImage filename="PrivateCalculation-dashboard.png" />
<TidasImage filename="PrivateCalculation-result.png" />

## 🔐 数据隐私保护机制

隐私计算平台采用多种技术确保数据安全性：

1. 数据全程加密 - 原始数据不出本地环境
2. 安全多方计算 - 在加密状态下进行计算
3. 计算结果安全性验证 - 确保结果数据不包含敏感信息
4. 全程计算审计日志 - 记录计算过程的每一步操作

> **示例场景**：两家钢铁企业需要比较生产过程中的粉尘排放数据，但不愿直接共享原始数据（1.707 t/h 与 1.197 t/h）。通过隐私计算平台，双方成功获得平均值 1.981949，用于行业基准比较，而无需暴露各自的原始数据。

## 💼 典型应用场景

1. 多企业间敏感环境数据协同分析
2. 跨组织供应链碳排放核算
3. 行业基准数据生成与比较
4. 合规数据安全共享

## 💡 核心价值

- 数据隐私保护：各方敏感数据不出本地环境
- 计算结果准确性：保证计算逻辑准确执行
- 合规合法：满足数据安全与隐私保护法规要求
- 促进数据价值释放：在保护隐私前提下实现数据协同

## 📝 总结

TIDAS结合隐私计算平台的解决方案，通过"数据准备-创建任务-安全计算-获取结果"的流程，实现了敏感数据的安全协同分析。该方案在保护数据隐私的同时，充分挖掘了数据价值，为企业数据安全合规利用提供了有效途径。
