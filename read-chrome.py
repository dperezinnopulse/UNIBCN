#!/usr/bin/env python3
import requests

try:
    r = requests.get("http://localhost:9226/json", timeout=1)
    tabs = r.json()
    print(f"Tabs: {len(tabs)}")
    if tabs:
        print(f"Title: {tabs[0].get('title', 'N/A')}")
        print(f"URL: {tabs[0].get('url', 'N/A')}")
except Exception as e:
    print(f"Error: {e}")
