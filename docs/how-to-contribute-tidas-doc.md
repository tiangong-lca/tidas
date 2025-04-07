---
sidebar_position: 9
---


# TIDAS文档开发指南

欢迎为TIDAS文档做贡献！以下是贡献流程：

## 1. Fork项目

- 访问[TIDAS GitHub页面](https://github.com/tiangong-lca/tidas)
- 点击右上角的"Fork"按钮
- 选择你的GitHub账户作为目标

![Fork位置](../static/img/en/git-fork.png)

## 2. 克隆仓库

```bash
git clone https://github.com/YOUR-USERNAME/tidas.git 
```

可以根据您的情况选择HTTPS或者SSH，如果您使用SSH，您需要在您的GitHub账户中添加SSH密钥。

![链接位置](../static/img/en/git-clone.png)

## 3. 进行修改

- 文档文件位于`docs/`目录下
- 使用Markdown语法编写文档
- 确保遵循现有文档风格

## 4. 提交更改

```bash
git add .
git commit -m "描述你的修改"
git push origin your-branch-name
```

## 5. 创建Pull Request (PR)

- 访问你fork后的GitHub仓库页面
- 点击"Compare & pull request"按钮
- 填写PR描述，说明你的修改内容
- 点击"Create pull request"

## 6. 代码审查

- 等待项目维护者review你的PR
- 根据反馈进行必要的修改

## 贡献指南

- 保持文档简洁清晰
- 遵循现有格式和风格
- 确保所有链接有效
- 使用正确的Markdown语法

推荐使用[VS Code](https://code.visualstudio.com/) 代码编辑器。

感谢你的贡献！
