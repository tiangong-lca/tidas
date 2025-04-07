---
sidebar_position: 3
---

# 数据结构验证

TIDAS 数据结构基于 JSON Schema 进行定义与实现，提供标准化、自动化的数据校验机制，以确保生命周期数据在编制、交换与共享过程中的准确性、一致性和可扩展性。

JSON Schema 是一种通用、开放的结构定义标准，不依赖特定平台或语言，验证方式灵活多样。用户可以使用 JavaScript 的 `ajv`、Python 的 `jsonschema`、Java 的 `everit` 等多种语言和工具进行数据结构校验，只需几行代码即可完成验证，非常适合快速集成与调试使用。

TIDAS 项目基于此能力开发了一个增强型工具 [`tidas-tools`](https://github.com/tiangong-lca/tidas-tools)，其中的 `validation.py` 脚本在标准 JSON Schema 校验的基础上，增加了针对 TIDAS 数据结构的分类层级逻辑校验与模块间引用解析，适合批量、多模块、高复杂度的数据验证需求。

---

## 验证方式

### 方式一：简单使用 JSON Schema 校验（以 Python 为例）

```python
from jsonschema import validate, ValidationError

with open("schema.json") as s:
    schema = json.load(s)
with open("data.json") as d:
    data = json.load(d)

try:
    validate(instance=data, schema=schema)
    print("验证通过")
except ValidationError as e:
    print("验证失败：", e.message)
```

适合开发调试阶段的单文件快速验证。

### 方式二：使用 TIDAS 工具批量验证

```bash
python validation.py --input-dir ./test_data --verbose
```

- `--input-dir`：待验证的 JSON 文件目录（包含 flows、processes 等子目录）
- `--verbose`：输出详细日志信息

更多信息参考 [TIDAS 工具介绍](/docs/category/tidas-tools)。

---

## 验证内容概览

TIDAS 的数据验证机制结合了两类校验能力：

### 1. 结构校验（JSON Schema 标准）

- 校验字段是否缺失（required）
- 校验字段类型是否匹配（string, number 等）
- 校验字段值是否符合定义（format, enum 等）
- 支持模块间引用解析（$ref）

### 2. 分类结构逻辑校验（TIDAS 特有）

适用于 flows、processes、sources 等分类结构：

- **层级检查**：字段 `@level` 顺序是否正确
- **代码规则**：子项是否以父项代码为前缀
- **流程分类行业匹配规则**：行业编码是否满足国家标准映射逻辑

---

## 验证结果输出

以下是典型错误输出信息示例：

```bash
{
  "message": "'name' is a required property",
  "path": ["flowDataSet", "flowInformation", "dataSetInformation"],
  "schemaPath": "#/required"
}
```

此错误表示 name 字段缺失，路径信息帮助定位具体出错位置。

验证完成后，输出每个文件的验证状态：

- ✅ `PASSED.`：验证成功
- ❌ `ERROR:`：指出出错文件及详细错误位置

建议调试阶段使用 `--verbose` 查看详细错误信息，快速定位问题。

---

如需了解 JSON Schema 的结构定义方式、字段命名规范与模块说明，请前往 [数据结构（JSON Schema）](json-schema.mdx)。如需了解 TIDAS 验证工具更多细节，请参考 [TIDAS工具包介绍](/docs/category/tidas-tools)。
