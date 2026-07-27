---
sidebar_position: 2
---

# Validate TIDAS data

Use `tidas validate` in the unified Rust CLI to validate TIDAS JSON or ILCD XML:

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

Before a reproducible run, record protocol, engine, and Schema-lock
fingerprints with `tidas validate --describe --format json`. The CLI uses only
embedded integrity-locked assets; `validation.py` and `tidas-validate` are not
v0.1.1 entry points.

See [Schema Validation](../core-modules/schema/tidas-schema-validation.md) for
package validation and batch-protocol details.
