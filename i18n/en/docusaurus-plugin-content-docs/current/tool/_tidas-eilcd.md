---
sidebar_position: 3
---

# Convert between TIDAS and eILCD

The unified Rust CLI uses `tidas convert` for bidirectional conversion between
TIDAS JSON and eILCD XML. The converter uses embedded integrity-locked Schema,
XSD, and XSLT assets, traverses the input package without following symlinks,
and atomically publishes the complete output directory.

## TIDAS to eILCD

```bash
tidas convert ./tidas-package \
  --output ./eilcd-package \
  --to ilcd \
  --format json
```

## eILCD to TIDAS

```bash
tidas convert ./eilcd-data \
  --output ./tidas-package \
  --to tidas \
  --format json
```

Validate the generated `OUTPUT/data` directory:

```bash
tidas validate ./eilcd-package/data --input-format ilcd-xml --format json
tidas validate ./tidas-package/data --input-format tidas-json --format json
```

The old `tidas-convert` flags `--input-dir`, `--output-dir`, `--to-eilcd`, and
`--to-tidas` do not apply to v0.1.1. Use `tidas convert --help`.
