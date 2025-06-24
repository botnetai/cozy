# Cozy Python SDK

Python SDK for the Cozy container runtime platform.

## Installation

```bash
pip install cozy-sdk
```

## Usage

```python
from cozy import CozyClient

client = CozyClient(api_url="https://api.cozy.dev", api_key="your-api-key")

# Execute code
result = client.execute_code(language="python", code="print('Hello, World!')")
print(result)
```