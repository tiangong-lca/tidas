---
sidebar_position: 4
---


# 数据导出

统一 Rust CLI 使用 `tidas export` 从一个只读、可重复读的 PostgreSQL
快照导出记录，并可流式读取 S3 兼容对象存储中的外部文档。结果作为确定性 ZIP
原子发布。

```bash
TIDAS_DATABASE_URL='postgresql://…' \
  tidas export --output ./tidas.zip --format json

TIDAS_DATABASE_URL='postgresql://…' \
  tidas export \
    --output ./eilcd.zip \
    --target ilcd \
    --skip-external-docs \
    --format json
```

访问对象存储时，仅通过环境变量传入凭据：

- `TIDAS_S3_ACCESS_KEY_ID`
- `TIDAS_S3_SECRET_ACCESS_KEY`
- 可选的 `TIDAS_S3_SESSION_TOKEN`

桶、区域和端点可用 `--external-docs-bucket`、`--s3-region` 和
`--s3-endpoint` 指定。凭据值不会出现在报告或诊断中。

旧 `tidas-export` 的输入目录、`.env` 文件和命令行凭据参数不适用于
v0.1.1；请以 `tidas export --help` 为准。
