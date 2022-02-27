# run with `python -m uvicorn server:app`

from enum import Enum
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

API_VERSION = 1


class EnvVars(str, Enum):
    # global
    BANNER_PATHS = "BANNERS_FOLDER"
    ITEM_DB = "ITEMS_FILE"
    SHOP_DB = "SHOP_FILE"
    QUEST_DB = "GLOBAL_QUESTS_FILE"

    # user-specific
    INVENTORY_DB = "INVENTORY_FILE"
    HISTORY_DB = "HISTORY_FILE"


load_dotenv()

app = FastAPI()

# config parsing
banner_paths = Path(os.getenv(EnvVars.BANNER_PATHS.value) or "banners")
banners: list[dict] = []
for json_banner in banner_paths.iterdir():
    if json_banner.suffix == ".json":
        with open(json_banner, encoding="utf-8") as file:
            banners.append(json.load(file))

items_path = Path(os.getenv(EnvVars.ITEM_DB.value) or "items.json")
with open(items_path, encoding="utf-8") as file:
    items = json.load(file)

shop_path = Path(os.getenv(EnvVars.SHOP_DB.value) or "shop.json")
with open(shop_path, encoding="utf-8") as file:
    shop = json.load(file)

quests_path = Path(os.getenv(EnvVars.QUEST_DB.value) or "quests.json")
with open(quests_path, encoding="utf-8") as file:
    quests = json.load(file)


@app.get(f"/v{API_VERSION}/banners/")
def api_banners() -> list:
    return banners


@app.get(f"v{API_VERSION}/items")
def api_items() -> dict:
    return items


@app.get(f"v{API_VERSION}/shop")
def api_shop() -> list:
    return shop


@app.get(f"v{API_VERSION}/quests")
def api_quests() -> dict:
    return quests
