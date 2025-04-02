---
sidebar_position: 3
---

# TIDAS Schema Validation

TIDAS Schema is based on JSON Schema specification and can be validated using various programming languages and tools.

## TIDAS Schema Validation Rules

TIDAS Schema includes the following validation rules:

1. **Data Type Validation**: Ensures field values conform to defined data types
2. **Required Field Validation**: Checks if all required fields are filled
3. **Value Range Validation**: Verifies if field values are within allowed ranges
4. **Reference Integrity Validation**: Checks if object references are correct
5. **Business Rule Validation**: Executes domain-specific business logic validation

## Common Validation Tools

- **JavaScript**: Ajv (Another JSON Schema Validator)
- **Python**: jsonschema library
- **Java**: json-schema-validator library
- **Command Line Tool**: ajv-cli

## Example Code

Python validation example:

```python
import json
from jsonschema import validate, ValidationError

# Load schema and data
with open('static/schemas/tidas_contacts.json') as f:
    schema = json.load(f)
    
with open('data/contact.json') as f:
    data = json.load(f)

# Execute validation
try:
    validate(instance=data, schema=schema)
    print("Data is valid")
except ValidationError as e:
    print(f"Validation error: {e.message}")
    print(f"Path: {e.json_path}")
    print(f"Schema path: {e.schema_path}")
```

JavaScript validation example:

```javascript
const Ajv = require('ajv');
const schema = require('./static/schemas/tidas_contacts.json');
const data = require('./data/contact.json');

// Create validator instance
const ajv = new Ajv();
const validate = ajv.compile(schema);

// Execute validation
const valid = validate(data);

if (!valid) {
  console.log('Validation errors:', validate.errors);
} else {
  console.log('Data is valid');
}
```

## Validation Error Handling

When validation fails, the validator returns detailed error information. This is crucial for debugging and fixing data issues. Error information structure:

```json
{
  "keyword": "required",
  "dataPath": ".contact",
  "schemaPath": "#/required",
  "params": {
    "missingProperty": "email"
  },
  "message": "Should have required property 'email'"
}
```

## Field Descriptions

- `keyword`: Type of validation rule violated
  - Common values: required (missing required field), type (type error), format (format error), enum (enum mismatch) etc.
- `dataPath`: Location of error in data
  - Uses JSON Pointer syntax, e.g. ".contact" means contact property of root object
- `schemaPath`: Location of validation rule in schema
  - Uses JSON Pointer syntax, points to rule definition in schema
- `params`: Parameters of validation rule
  - Contains specific failure info like missing property name, expected type etc.
- `message`: Human-readable error description
  - Contains specific error reason and expected value

## Common Error Examples

- Missing required field:

```json
{
  "keyword": "required",
  "message": "Should have required property 'name'"
}
```

- Data type error:

```json
{
  "keyword": "type",
  "message": "Should be string type"
}
```

- Format validation failed:

```json
{
  "keyword": "format",
  "message": "Should match format \"email\""
}
```

## Validation Result Interpretation

Validation results may include:

1. Data fully complies with Schema
2. Data type mismatch
3. Missing required fields
4. Values outside allowed range
5. Incomplete reference relationships
6. Business rule violations
