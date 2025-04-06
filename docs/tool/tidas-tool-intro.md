---
sidebar_position: 1
---


# 工具包介绍

TIDAS 工具包是围绕天工 LCA 数据系统设计的一组轻量工具，支持数据的验证、格式互转与交付导出操作，帮助开发者高效构建合规的生命周期数据库。

---

## 🔍 工具能力一览

TIDAS 工具包包括以下三个核心功能模块：

- ✅ **数据验证（tidas-validate）**：检查 TIDAS 数据的结构、完整性与一致性，确保数据符合标准格式。
- 🔄 **格式转换（tidas-convert）**：实现 TIDAS 与 eILCD 数据格式的双向转换，保持数据语义和信息的完整。
- 📦 **数据导出（tidas-export）**：将合规数据打包为标准 ZIP 格式，支持交付、归档与平台上传。

> 所有功能均支持批量处理，适配 GitHub Actions 和 CI/CD 工作流。

---

## 🚀 快速开始

1. 安装工具包  
   ```bash
   pip install tidas-tools
   ```

2. 查看完整文档与示例  
   👉 [📚 tidas-tools 开发文档（持续更新）](https://github.com/tiangong-lca/tidas-tools)

---

## 📬 获取帮助 & 参与共建

我们欢迎开发者和数据使用者共同完善工具：

- 📌 提出问题或功能建议：[提交 Issue](https://github.com/tiangong-lca/tidas-tools/issues)
- 🤝 参与开发：[加入我们](https://github.com/tiangong-lca/tidas-tools#contributing)

---

**关于 TIDAS：**  
TIDAS 是天工计划打造的 LCA 开源数据系统，具备高扩展性和 AI 数据适配能力。  
👉 [了解 TIDAS 架构](/docs/category/tidas-schema)