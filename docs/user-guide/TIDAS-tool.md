---
sidebar_position: 2
---


# TIDAS Tools 快速入门指南

TIDAS Tools 是一个基于Python的跨平台CLI工具集，用于处理TIDAS和eILCD数据格式。它通过pip包管理器安装，支持Linux、Windows和macOS系统，提供了一系列命令行工具，主要功能包括：

- 数据格式转换（TIDAS ↔ eILCD）
- 数据格式验证
- 数据导出

## 1. 安装工具

安装TIDAS Tools到Python环境：

```bash
pip install tidas-tools
```

## 2. TIDAS和eILCD数据格式双向无损映射

### TIDAS → eILCD

将TIDAS格式转换为eILCD格式：

```bash
tidas-convert -i TIDAS数据目录 -o 输出目录 --to-eilcd
```

### eILCD → TIDAS  

将eILCD格式转换为TIDAS格式：

```bash
tidas-convert -i eILCD数据目录 -o 输出目录 --to-tidas
```

## 3. 数据验证

验证TIDAS数据格式是否正确：

```bash
tidas-validate -i TIDAS数据目录
```

## 4. 数据导出

### 导出为TIDAS格式

将数据导出为TIDAS格式并打包：

```bash
tidas-export -i 输入目录 -z 输出zip文件 --to-tidas
```

### 导出为eILCD格式

将数据导出为eILCD格式并打包：

```bash
tidas-export -i 输入目录 -z 输出zip文件 --to-eilcd
```

## 更多信息

如需了解更多详细说明，请前往[TIDAS-tool](https://github.com/tiangong-lca/tidas-tools)
