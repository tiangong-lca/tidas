---
sidebar_position: 2
---


# TIDAS 数据格式校验

统一 Rust CLI 使用 `tidas validate` 校验 TIDAS JSON 或 ILCD XML：

```bash
tidas validate ./tidas-package \
  --input-format tidas-json \
  --issues ./issues.jsonl \
  --format json

tidas validate ./ilcd-package \
  --input-format ilcd-xml \
  --issues ./issues.jsonl \
  --format json
```

运行前可用 `tidas validate --describe --format json` 记录协议、引擎和 Schema
锁指纹。CLI 只使用内嵌的完整性锁定资源；旧 `validation.py` 和
`tidas-validate` 不是 v0.1.1 的入口。

更完整的包校验与批处理协议说明见
[Schema 校验方法](../core-modules/schema/tidas-schema-validation.md)。
