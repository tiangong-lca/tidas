---
sidebar_position: 2
---

# TIDAS 快速教程

## 基础概念

### TIDAS 简介
TIDAS（TianGong Integrated Data Analysis System）是一个开源的生命周期评估（LCA）数据标准化和互操作性平台。详情可见[TIDAS 是什么](/docs/intro.mdx)。

### 核心特性
- **标准化格式**：基于JSON Schema的数据结构
- **模块化架构**：支持灵活扩展
- **数据互操作性**：支持多种LCA工具数据交换

## 工具使用教程

### TIDAS 工具集概述
TIDAS提供以下核心功能工具：
1. 数据格式转换工具
2. 数据验证工具
3. 数据导出工具

完整功能参考：[工具文档](/docs/tool/TIDAS-tool.md)

### 安装与配置
```bash
pip install tidas-tool
tidas --version  # 验证安装
```

### 基础操作指南

以下操作是TIDAS工具的核心功能，用于确保数据质量和互操作性：

#### 1. 数据验证
验证数据是否符合TIDAS Schema规范：
```bash
tidas validate /path/to/data.json
```

#### 2. 格式转换
将其他LCA数据格式(如eILCD)转换为TIDAS标准格式：
```bash
tidas convert --input ilcd.xml --output tidas.json
```

关于JSON与XML格式的详细对比，请参考：[TIDAS与ILCD格式对比](/docs/schema/TIDAS-vs-ILCD.md)

#### 3. Schema应用
1. 获取Schema文件：
```bash
git clone https://github.com/tiangong/tidas-tools.git
cd tidas-tools/src/tidas_tools/tidas/schemas/
```
2. 集成到开发环境
3. 使用JSON验证工具

## 集成案例
### 天工LCA平台

TIDAS可以集成到各类LCA平台，其中天工LCA平台(TianGong LCA)是最完整的实现案例：

- 基于TIDAS(TIangong DAta System)构建的开源LCA数据平台
- 提供灵活的部署方式：在线系统或本地私有化部署
- 支持多团队协作完成复杂LCA项目
- 全球最大的TIDAS数据共享平台

[查看完整案例](https://docs.tiangong.earth/) | [集成指南](/docs/use_case/tiangong_builder.md)


## 进阶应用

### 区块链功能使用
[区块链数据映射教程](./blockchain/data-mapping.md)

### 自定义扩展开发
参考[开发者文档](/docs/how-to-contribut-tidas-doc.md)

## 资源与支持
- [示例数据文件](static/schemas/)
- [Schema参考文档](./schema/TIDAS-Schema.md)
- [问题反馈渠道](/docs/resources-and-support.md)
