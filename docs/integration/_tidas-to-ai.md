---
sidebar_position: 3
---

# MCP AI 服务

MCP AI 服务是 TIDAS 系统中基于 AI 的智能引擎组件，旨在提升生命周期数据的理解、补全与校验能力，适配新一代环境数据管理与智能应用场景。

✨ 核心功能
MCP（Multi-channel Cognitive Processor）集成了 AI 能力至 TIDAS 生命周期数据库中，提供如下核心服务：

语义搜索：通过自然语言查询生命周期清单（LCA Flows）数据

智能补全：辅助补充缺失字段或建议结构完善

格式校验：基于 JSON Schema 自动校验数据合规性

人机交互界面：通过 MCP Inspector 可视化操作和调试流程（见下图）

import TidasImage from '@site/src/components/TidasImage';

<TidasImage filename="MCP-inpector" />

📷 图示：搜索“Cypermethrin”相关流信息，成功返回结构化数据