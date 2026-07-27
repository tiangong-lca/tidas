---
sidebar_position: 4
---

# Export data

The unified Rust CLI uses `tidas export` to read records from a read-only,
repeatable-read PostgreSQL snapshot and optionally stream external documents
from S3-compatible object storage. It atomically publishes a deterministic ZIP.

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

Pass object-storage credentials only through environment variables:

- `TIDAS_S3_ACCESS_KEY_ID`
- `TIDAS_S3_SECRET_ACCESS_KEY`
- optional `TIDAS_S3_SESSION_TOKEN`

Set the bucket, region, and endpoint with `--external-docs-bucket`,
`--s3-region`, and `--s3-endpoint`. Credential values never appear in reports
or diagnostics.

The old `tidas-export` input-directory, `.env` file, and command-line
credential flags do not apply to v0.1.1. Use `tidas export --help`.
