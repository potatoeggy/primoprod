# run with `python -m uvicorn server:app`

import json
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI

API_VERSION = 1

load_dotenv()

app = FastAPI()


@app.get(f"/v{API_VERSION}/banners/")
def banners():
    return [{
        "name": "Gentry of Hermitage",
        "styles": [
            {
                "color": "#cc9046",
                "text": "Gentry"
            },
            {"text": " of Hermitage"}
        ],
        "id": "gentry-of-hermitage-3",
        "storage": "event",
        "description": "Character Event Wish",
        "featuredDrops": ["zhongli", "beidou", "xingqiu", "yanfei"],
        "drops": [
            "jean",
            "qiqi",
            "keqing",
            "mona",
            "diluc",
            "sucrose",
            "diona",
            "fischl",
            "razor",
            "diona",
            "xinyan",
            "ningguang",
            "chongyun",
            "thoma",
            "diona",
            "sayu",
            "bennett",
            "rosaria",
            "noelle",
            "ningguang",
            "chongyun",
            "yun-jin",
            "gorou",
            "barbara",
            "xiangling",
            "favonius-warbow",
            "sacrificial-bow",
            "the-stringless",
            "rust",
            "favonius-codex",
            "sacrificial-fragments",
            "the-widsith",
            "eye-of-perception",
            "favonius-greatsword",
            "sacrificial-greatsword",
            "the-bell",
            "rainslasher",
            "favonius-lance",
            "dragons-bane",
            "favonius-sword",
            "sacrificial-sword",
            "the-flute",
            "lions-roar",
            "slingshot",
            "sharpshooters-oath",
            "raven-bow",
            "emerald-orb",
            "thrilling-tales-of-dragon-slayers",
            "magic-guide",
            "debate-club",
            "bloodtainted-greatsword",
            "ferrous-shadow",
            "black-tassel",
            "skyrider-sword",
            "harbinger-of-dawn",
            "cool-steel"
        ]
    }]


if __name__ == "__main__":
    pass
