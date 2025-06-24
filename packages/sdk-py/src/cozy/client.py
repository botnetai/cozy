import httpx
from typing import Optional, Literal


class CozyClient:
    def __init__(self, api_url: str, api_key: Optional[str] = None):
        self.api_url = api_url.rstrip("/")
        self.headers = {}
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"
        self.client = httpx.Client(headers=self.headers)
    
    def execute_code(
        self, 
        language: Literal["javascript", "python", "typescript"], 
        code: str
    ) -> dict:
        response = self.client.post(
            f"{self.api_url}/container/execute",
            json={"language": language, "code": code}
        )
        response.raise_for_status()
        return response.json()
    
    def hello(self, name: str) -> dict:
        # This would normally call the tRPC endpoint
        # For now, it's a placeholder
        return {"greeting": f"Hello {name}!"}
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.client.close()