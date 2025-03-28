---
sidebar_position: 1
---

# TIDAS Schema 用户指南

本指南将帮助您了解TIDAS Schema的基本概念、验证规则和使用方法。如果您是第一次使用TIDAS Schema，请从这里开始。

## TIDAS Schema 简介

TIDAS Schema 是一个基于JSON Schema的生命周期评估（LCA）数据规范框架，旨在实现LCA数据的标准化和互操作性。它通过定义严格的数据结构和验证规则，确保不同系统间的数据交换质量，有效统一了LCA数据格式，消除了数据孤岛问题。通过自动化验证机制确保数据完整性，支持不同LCA工具间的无缝数据交换，同时采用模块化设计支持业务扩展需求。TIDAS Schema包含17个文件，具体内容可见[TIDAS Schema](/docs/schema/json-schema)

### 主要功能

- **数据建模**：定义标准化的LCA数据结构
- **数据验证**：实时验证数据完整性和合规性
- **元数据管理**：维护数据来源、版本等元信息
- **分类体系**：提供标准化的分类和编码体系

### 技术特点

- 基于JSON Schema规范
- 模块化架构设计
- 支持多语言验证
- 提供详细的错误诊断信息

## TIDAS Schema 验证规则

TIDAS Schema 包含以下验证规则：

1. **数据类型验证**：确保字段值符合定义的数据类型
2. **必填字段验证**：检查所有必填字段是否已填写
3. **值域验证**：验证字段值是否在允许的范围内
4. **引用完整性验证**：检查对象之间的引用关系是否正确
5. **业务规则验证**：执行特定领域的业务逻辑验证

## 如何使用TIDAS Schema文件

### 验证数据

TIDAS Schema基于JSON Schema规范，可以使用多种编程语言和工具进行验证。以下是使用Python进行验证的示例：

```python
import json
from jsonschema import validate, ValidationError

# 加载schema和数据
with open('static/schemas/tidas_contacts.json') as f:
    schema = json.load(f)
    
with open('data/contact.json') as f:
    data = json.load(f)

# 执行验证
try:
    validate(instance=data, schema=schema)
    print("Data is valid")
except ValidationError as e:
    print(f"Validation error: {e.message}")
    print(f"Path: {e.json_path}")
    print(f"Schema path: {e.schema_path}")
```

以下是使用JavaScript进行验证的示例：

```javascript
const Ajv = require('ajv');
const schema = require('./static/schemas/tidas_contacts.json');
const data = require('./data/contact.json');

// 创建验证器实例
const ajv = new Ajv();
const validate = ajv.compile(schema);

// 执行验证
const valid = validate(data);

if (!valid) {
  console.log('Validation errors:', validate.errors);
} else {
  console.log('Data is valid');
}
```

### 常用验证工具

- **JavaScript**: Ajv (Another JSON Schema Validator)
- **Python**: jsonschema 库
- **Java**: json-schema-validator 库
- **命令行工具**: ajv-cli

### 验证错误处理

当数据验证失败时，验证器会返回详细的错误信息。这些信息对于调试和修复数据问题非常重要。以下是错误信息的详细说明：

1 **错误信息结构**

```json
{
  "keyword": "required",
  "dataPath": ".contact",
  "schemaPath": "#/required",
  "params": {
    "missingProperty": "email"
  },
  "message": "应当具有必需属性 'email'"
}
```

2 **字段说明**

- `keyword`: 违反的验证规则类型
  - 常见值：required（必填字段缺失）、type（类型错误）、format（格式错误）、enum（枚举值不匹配）等
- `dataPath`: 数据中出错的位置
  - 使用JSON Pointer语法表示，如".contact"表示根对象的contact属性
- `schemaPath`: Schema中对应的验证规则位置
  - 使用JSON Pointer语法表示，指向schema中定义该验证规则的位置
- `params`: 验证规则的参数
  - 包含验证失败的具体信息，如缺失的属性名、期望的类型等
- `message`: 人类可读的错误描述
  - 包含具体的错误原因和期望值

3 **常见错误示例**

- 必填字段缺失：

```json
{
  "keyword": "required",
  "message": "应当具有必需属性 'name'"
}
```

- 数据类型错误：

```json
{
  "keyword": "type",
  "message": "应当是 string 类型"
}
```

- 格式验证失败：

```json
{
  "keyword": "format",
  "message": "应当匹配格式 \"email\""
}
```

### 验证结果解释

验证结果可能包含以下情况：

1. 数据完全符合Schema
2. 数据类型不匹配
3. 必填字段缺失
4. 值超出允许范围
5. 引用关系不完整
6. 违反业务规则

## TIDAS Schema 使用场景

TIDAS Schema 在以下业务场景中发挥关键作用：

1. **数据交换**
   - 不同LCA系统间的数据迁移
   - 供应链上下游数据共享
   - 跨组织数据协作

2. **系统集成**
   - LCA工具与ERP/MES系统对接
   - 数据仓库建设
   - 数据分析平台集成

3. **质量管理**
   - 数据完整性检查
   - 数据一致性验证
   - 数据版本控制

4. **标准化建设**
   - 行业数据标准制定
   - 企业数据治理
   - 合规性检查
