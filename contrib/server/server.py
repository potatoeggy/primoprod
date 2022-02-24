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
    banner_paths = "BANNERS_FOLDER"
    item_db = "ITEMS_FILE"
    shop_db = "SHOP_FILE"
    quest_db = "GLOBAL_QUEST_FILE"

    # user-specific
    inventory_db = "INVENTORY_FILE"
    history_db = "HISTORY_FILE"


load_dotenv()

app = FastAPI()

# config parsing
banner_paths = Path(os.getenv(EnvVars.banner_paths.value) or "banners")
banners: list[dict] = []
for json_banner in banner_paths.iterdir():
    if json_banner.suffix == ".json":
        with open(json_banner, encoding="utf-8") as file:
            banners.append(json.load(file))

items_path = Path(os.getenv(EnvVars.item_db.value) or "items.json")
with open(items_path, encoding="utf-8") as file:
    items = json.load(file)

shop_path = Path(os.getenv(EnvVars.shop_db.value) or "shop.json")
with open(shop_path, encoding="utf-8") as file:
    shop = json.load(file)

quests_path = Path(os.getenv(EnvVars.quest_db.value) or "quests.json")
with open(quests_path, encoding="utf-8") as file:
    quests = json.load(file)


@app.get(f"/v{API_VERSION}/banners/")
def api_banners():
    return banners


@app.get(f"v{API_VERSION}/items")
def api_items():
    return items


@app.get(f"v{API_VERSION}/shop")
def api_shop():
    return shop


@app.get(f"v{API_VERSION}/quests")
def api_quests():
    return quests
