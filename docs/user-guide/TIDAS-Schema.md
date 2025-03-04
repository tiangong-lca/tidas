---
sidebar_position: 1
---

# TIDAS Schema 配置

欢迎使用本指南！本指南将帮助您了解如何配置TIDAS Schema。

## TIDAS Schema 简介

TIDAS Schema 是一个基于JSON结构的schema验证，确保数据结构的规范性。TIDAS schema 由以下几个部分组成：

- **`data_types.json`**: 包含了生命周期数据的基本数据类型，包括数据类型的名称、描述、单位等信息。
- **`tidas_classification_category.json`**: 用于定义 LCA 数据中各类“分类层级”或“分类标准”的结构信息。一般应用于为流程（Processes）或流（Flows）等对象进行分类。
- **`tidas_contacts.json`** 用于维护与 LCA 数据相关的联系人信息，如研究人员、数据提供者、审核人等。
- **`tidas_flowproperties.json`**: 包含了生命周期数据的流属性，包括流属性的名称、描述、单位等信息。
- **`tidas_flows_elementary_category.json`**: 包含了生命周期数据的基本流分类，包括基本流分类的名称、描述、基本流分类等信息。
- **`tidas_flows_product_category.json`**: 包含了生命周期数据的产品流分类，包括产品分类的名称、描述等信息。
- **`tidas_flow.json`**: 包含了生命周期数据的流信息，包括流的名称、描述、流属性等信息。
- **`tidas_lciamethods.json`**: 包含了生命周期数据的LCIA方法，包括LCIA方法的名称、描述、单位等信息。
- **`tidas_lifecyclemodels.json`**: 包含了生命周期数据的生命周期模型，包括生命周期模型的名称、描述、生命周期模型等信息。
- **`tidas_locations_category.json`**: 包含了生命周期数据的地点信息，包括地点的名称、描述、地点等信息。
- **`tidas_process_category.json`**: 包含了生命周期数据的单元过程分类，包括单元过程分类的名称、描述等信息。
- **`tidas_process.json`"**: 包含了生命周期数据的单元过程，包括单元过程的名称、描述、输入输出流等信息。
- **`tidas_sources.json`**: 包含了生命周期数据的数据来源，包括数据来源的名称、描述、数据来源等信息。
- **`tidas_unitgroups.json`**: 包含了生命周期数据的单位组，包括单位组的名称、描述、单位等信息。

具体内容详见[TIDAS Schema](/docs/json-schema)

## TIDAS Schema 使用场景

TIDAS Schema 主要用于以下场景：

- 数据交换和共享时的格式验证
- 数据质量控制和完整性检查
- 数据建模和系统集成
- 数据标准化和互操作性

## Schema 验证规则

TIDAS Schema 包含以下验证规则：

1. 数据类型验证：确保字段值符合定义的数据类型
2. 必填字段验证：检查所有必填字段是否已填写
3. 值域验证：验证字段值是否在允许的范围内
4. 引用完整性验证：检查对象之间的引用关系是否正确
5. 业务规则验证：执行特定领域的业务逻辑验证

## Schema 版本管理

TIDAS Schema 采用语义化版本控制（SemVer）：

- 主版本号：不兼容的API修改
- 次版本号：向下兼容的功能新增
- 修订号：向下兼容的问题修正

## Schema 扩展与自定义

用户可以通过以下方式扩展Schema：

1. 添加自定义字段
2. 定义新的数据类型
3. 创建新的分类体系
4. 扩展验证规则

## 如何使用Schema文件
