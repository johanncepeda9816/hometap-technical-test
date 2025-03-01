import os
import requests
from dotenv import load_dotenv

load_dotenv()


class Provider1Service:
    def __init__(self):
        self.api_key = os.getenv("PROVIDER1_API_KEY")
        self.base_url = os.getenv("PROVIDER1_API_URL")

    def get_property_details(self, address):
        headers = {"X-API-KEY": self.api_key, "Accept": "application/json"}

        params = {"address": address}

        try:
            response = requests.get(
                self.base_url,
                headers=headers,
                params=params,
                timeout=30,
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
