---
sidebar_position: 3
---

# 数据结构验证

TIDAS Schema基于JSON Schema规范，可以使用多种编程语言和工具进行验证。

## TIDAS Schema 验证规则

TIDAS Schema 包含以下验证规则：

1. **数据类型验证**：确保字段值符合定义的数据类型
2. **必填字段验证**：检查所有必填字段是否已填写
3. **值域验证**：验证字段值是否在允许的范围内
4. **引用完整性验证**：检查对象之间的引用关系是否正确
5. **业务规则验证**：执行特定领域的业务逻辑验证

## 常用验证工具

- **JavaScript**: Ajv (Another JSON Schema Validator)
- **Python**: jsonschema 库
- **Java**: json-schema-validator 库
- **命令行工具**: ajv-cli

## 示例代码

以下是使用Python进行验证的示例：

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

## 验证错误处理

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

## 验证结果解释

验证结果可能包含以下情况：

1. 数据完全符合Schema
2. 数据类型不匹配
3. 必填字段缺失
4. 值超出允许范围
5. 引用关系不完整
6. 违反业务规则
