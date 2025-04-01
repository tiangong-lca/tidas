---
sidebar_position: 2
---

# 快速开始

## TIDAS架构的工业级实现——[天工LCA平台](https://docs.tiangong.earth/)

作为TIDAS（TIangong DAta System）架构的首个开源实现平台，提供符合国际标准的全流程LCA解决方案：

- **架构完整性**：100%实现TIDAS数据架构与API规范，通过工业场景验证
- **混合部署能力**：支持云端SaaS服务与企业级本地化部署
- **分布式协作**：基于RBAC权限模型的跨组织项目管理体系
- **生态枢纽**：聚合全球70+行业TIDAS标准数据集

# 技术集成与扩展

## TIDAS与区块链
通过区块链锚定技术实现LCA数据全链路可信存证：
- **[TIDAS用于区块链的解决方案](./blockchain/TIDAS-to-blockchain.md)**  
  提供跨链数据包封装标准（含IPFS哈希锚定方案）与智能合约开发模板库

- **[蚂蚁链集成方案](./blockchain/TIDAS-to-ANTCHAIN.md)**  
  基于TIDAS JSON Schema构建轻节点验证框架，提供企业级BaaS服务

- **[Hyperledger适配指南](./blockchain/TIDAS-to-Hyperledger.md)**  
  联盟链场景下的隐私增强型实施方案

## TIDAS与LCA分析工具

实现与LCA软件的即插即用式集成：
- **[海科数据](./use_case/block_builder.md)**  
  支持TIDAS数据集一键导入与模型映射配置
- *（开发中）openLCA集成方案* 
- *（开发中）SimaPro集成方案*
- *（开发中）Brightway集成方案* 

## TIDAS与AI
*（开发中）MCP searver*
*（开发中）基于大语言模型的LCA数据智能校验与情景生成框架*


# 开发者指南

## TIDAS数据模型
基于JSON Schema构建的可扩展数据架构：
- [Schema规范文档](/docs/schema/TIDAS-Schema.md)  


## 开发工具箱
TIDAS提供了一些开发工具，帮助用户更方便地进行数据验证和转换。以下是一些常用的开发工具：
- **Schema验证工具**：CLI/GUI双模式校验，支持自定义规则注入
- **格式转换引擎**：支持eILCD格式互转
- **TIDAS数据导出工具**：用于将TIDAS数据导出，以便于与其他系统进行集成和共享。

## 数据库构建导则
TIDAS遵循[LCA/碳足迹数据库构建导则](https://www.carbonfootprint.network/docs/category/lca-database-guideline),用户可以根据指南，结合TIDAS的JSON Schema，开发自己的LCA数据库。

# 社区共建
- TIDAS开发：
    参考[开发者文档](/docs/how-to-contribut-tidas-doc.md)
- 问题反馈：  
  🐞 [Bug报告](https://github.com/tiangong-lca/tidas/issues)  
- 企业伙伴计划
    *（开发中）获取定制化技术支持的绿色通道*
- 商业支持：contact@tiangong.earth（获取SLA保障服务）
