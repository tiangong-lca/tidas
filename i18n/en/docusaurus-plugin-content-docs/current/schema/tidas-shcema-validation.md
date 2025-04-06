---
sidebar_position: 3
---

# Schema Validation

TIDAS data structure is defined and implemented based on JSON Schema, providing standardized, automated data validation mechanisms to ensure accuracy, consistency, and extensibility of lifecycle data during compilation, exchange and sharing.

JSON Schema is a universal, open structure definition standard that is platform and language independent, with flexible validation methods. Users can validate data structure using various languages and tools like JavaScript's `ajv`, Python's `jsonschema`, Java's `everit`, etc. Validation can be completed with just a few lines of code, making it ideal for rapid integration and debugging.

The TIDAS project has developed an enhanced tool [`tidas-tools`](https://github.com/tiangong-lca/tidas-tools) based on this capability. The `validation.py` script adds classification hierarchy logic validation and inter-module reference resolution for TIDAS data structures on top of standard JSON Schema validation, suitable for batch, multi-module, high-complexity data validation needs.

---

## Validation Methods

### Method 1: Simple JSON Schema Validation (Python Example)

```python
from jsonschema import validate, ValidationError

with open("schema.json") as s:
    schema = json.load(s)
with open("data.json") as d:
    data = json.load(d)

try:
    validate(instance=data, schema=schema)
    print("Validation passed")
except ValidationError as e:
    print("Validation failed:", e.message)
```

Suitable for quick single-file validation during development and debugging.

### Method 2: Batch Validation Using TIDAS Tools

```bash
python validation.py --input-dir ./test_data --verbose
```

- `--input-dir`: Directory containing JSON files to validate (with subdirectories like flows, processes)
- `--verbose`: Output detailed log information

For more information see [TIDAS Tools Introduction](/docs/category/tidas-tool).

---

## Validation Content Overview

TIDAS validation combines two types of checks:

### 1. Structure Validation (JSON Schema Standard)

- Check for missing fields (required)
- Check field type matching (string, number, etc.)
- Check field values against definitions (format, enum, etc.)
- Support inter-module reference resolution ($ref)

### 2. Classification Structure Logic Validation (TIDAS Specific)

For classification structures like flows, processes, sources:

- **Hierarchy Check**: Verify `@level` sequence is correct
- **Code Rules**: Verify child items use parent item codes as prefix
- **Process Classification Industry Matching**: Verify industry codes comply with national standard mapping logic

---

## Validation Result Output

Example of typical error output:

```bash
{
  "message": "'name' is a required property",
  "path": ["flowDataSet", "flowInformation", "dataSetInformation"],
  "schemaPath": "#/required"
}
```

This error indicates the name field is missing, with path information helping locate the exact error position.

After validation completes, each file's status is output:

- ✅ `PASSED.`: Validation succeeded
- ❌ `ERROR:`: Indicates problematic files and error locations

For debugging, use `--verbose` to view detailed error information and quickly locate issues.

---

To learn about JSON Schema structure definition, field naming conventions and module descriptions, see [Data Structure (JSON Schema)](json-schema.mdx). For more details about TIDAS validation tools, refer to [TIDAS Tools Introduction](/docs/category/tidas-tool).
