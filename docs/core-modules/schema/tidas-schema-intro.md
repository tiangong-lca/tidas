---
sidebar_position: 1
---

# 简要介绍

TIDAS Schema 是一个基于 JSON Schema 构建的生命周期评估（LCA）数据标准框架，旨在提升 LCA 数据的标准化水平、互操作能力与智能应用潜力。TIDAS 数据结构在设计上与 ILCD（International Life Cycle Data system）标准完全对齐，在架构中完整保留 ILCD XML 格式中使用的前缀体系，实现了对 ILCD XML 文件的无损映射。

与传统的 ILCD 所采用的 XML 格式相比，TIDAS 采用 JSON 结构，在简洁性、可读性、可扩展性及系统集成能力方面具备显著优势。这一设计使得 TIDAS 在保持与现有国际数据标准兼容的同时，更易于与现代数字基础设施（如区块链系统、数据空间、人工智能引擎等）进行对接，增强了数据的流通性、智能性和可信性。

> 👉 [点击这里下载使用 **TIDAS** 的 JSON Schema文件](https://github.com/tiangong-lca/tidas-tools/tree/main/src/tidas_tools/tidas/schemas)

## 技术特点

- **基于 JSON Schema 规范**  
  使用 JSON Schema 定义字段类型、结构层级和约束条件，实现结构化校验与自动化解析，便于开发与系统集成。

- **模块化架构设计**  
  Schema 被划分为多个逻辑模块（共 17 个），支持灵活调用与快速扩展，适应多种应用场景下的复用需求。

- **支持多语言验证**  
  通过通用的 JSON Schema 校验机制，可被多种编程语言与验证引擎直接支持，方便在不同系统中进行集成与应用。

- **提供详细的错误诊断信息**  
  基于 JSON Schema 的校验可返回结构化的错误信息，提升调试效率，保障数据质量。

- **增强的数据要求**  
  在对 ILCD 格式进行无损映射的基础上，TIDAS Schema 进一步引入了对 EF（Environmental Footprint）、GLAD（Global LCA Data Access）等标准的内容要求。例如对某些字段设定为必填项，增强了数据的完整性与可交换性。满足 TIDAS JSON Schema 的数据，必然也满足 ILCD 的基本规范，进一步保障数据的国际互认与流通。

> 👉 [点击这里查看和下载 **ILCD** 的 Schema 文件和样式表](https://github.com/tiangong-lca/tidas-tools/tree/main/src/tidas_tools/eilcd)

## 文件结构与使用

TIDAS Schema 由 17 个核心 JSON Schema 文件组成，每个文件描述了一个具体数据模块，具体内容详见 [数据结构（JSON Schema）](/docs/category/tidas-json-schema)。

如需了解如何使用 JSON Schema 进行数据验证和格式转换，请参考 [数据结构验证](./tidas-schema-validation.md)。
