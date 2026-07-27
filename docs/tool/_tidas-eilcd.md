---
sidebar_position: 3
---


# TIDAS 和 eILCD 数据格式转换

统一 Rust CLI 的 `tidas convert` 在 TIDAS JSON 与 eILCD XML 之间双向转换。
转换器使用内嵌的完整性锁定 Schema、XSD 和 XSLT，递归遍历输入包且不跟随符号链接，
最后原子发布完整输出目录。

## TIDAS 转 eILCD

```bash
tidas convert ./tidas-package \
  --output ./eilcd-package \
  --to ilcd \
  --format json
```

## eILCD 转 TIDAS

```bash
tidas convert ./eilcd-data \
  --output ./tidas-package \
  --to tidas \
  --format json
```

转换后应校验生成的 `OUTPUT/data`：

```bash
tidas validate ./eilcd-package/data --input-format ilcd-xml --format json
tidas validate ./tidas-package/data --input-format tidas-json --format json
```

旧 `tidas-convert` 的 `--input-dir`、`--output-dir`、`--to-eilcd` 和
`--to-tidas` 参数不适用于 v0.1.1。请以 `tidas convert --help` 为准。
