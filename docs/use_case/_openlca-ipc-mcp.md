# 使用TIDAS的MCP服务调用openLCA的IPC服务获取LCIA结果

本指南说明了如何利用天工LCA设计的MCP服务调用openLCA的IPC服务，从而获得在openLCA中构建的System Process的生命周期影响评价（LCIA）结果。

## 前置准备

1. **使用支持MCP协议的客户端加载MCP服务**

   * 首先确保已安装支持MCP协议的客户端。
   * 加载`tiangong-lca-mcp`服务，具体操作方法请参考[GitHub项目文档](https://github.com/linancn/tiangong-lca-mcp)。

2. **在openLCA中构建生命周期模型**

   * 在openLCA软件中提前构建完整的产品生命周期模型。
   * 模型运行后，将结果保存为System Process。

3. **导入LCIA方法文件**

   * 在openLCA中导入相应的LCIA方法文件，确保该方法文件成功加载。

## 操作流程

1. **启动openLCA的IPC服务**

   * 在openLCA客户端启动IPC服务，默认监听地址为`http://localhost:8080`。

2. **提供必要的信息给MCP服务**

   * 准备好以下信息：

     * System Process的名称及对应的UUID
     * EF 3.1 LCIA方法的名称及对应的UUID

3. **调用MCP服务获取LCIA结果**

   * 通过支持MCP协议的客户端调用MCP服务，传入上一步准备的必要信息。
   * 获取对应的生命周期影响评价结果。

## 注意事项

* 请确保openLCA的IPC服务正常运行，端口未被占用。
* 确认提供的System Process和LCIA方法信息准确无误。
