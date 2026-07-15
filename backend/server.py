from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import random
import secrets
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Relic Catalog ----------
RELIC_CATALOG = [
    {"key": "genesis",       "name": "Genesis",       "max_supply": 1,       "rarity_weight": 0.0001,
     "description_pt": "A primeira Relic da história da Nexora. Nunca existirá outra.",
     "description_en": "The first Relic in Nexora's history. No other will ever exist.",
     "history_pt": "Forjada no instante zero da coleção. Símbolo absoluto de origem.",
     "history_en": "Forged at the collection's instant zero. The absolute symbol of origin."},
    {"key": "aeternum",      "name": "Aeternum",      "max_supply": 10,      "rarity_weight": 0.001,
     "description_pt": "Representa a eternidade.",
     "description_en": "Represents eternity.",
     "history_pt": "Um anel sem fim, testemunha silenciosa do tempo.",
     "history_en": "A ring without end, silent witness of time."},
    {"key": "constellation", "name": "Constellation", "max_supply": 100,     "rarity_weight": 0.01,
     "description_pt": "Inspirada no universo.",
     "description_en": "Inspired by the universe.",
     "history_pt": "Cada nó, uma estrela; cada linha, uma memória cósmica.",
     "history_en": "Each node a star; each line a cosmic memory."},
    {"key": "eclipse",       "name": "Eclipse",       "max_supply": 500,     "rarity_weight": 0.03,
     "description_pt": "Representa um fenômeno raro.",
     "description_en": "Represents a rare phenomenon.",
     "history_pt": "O disco escuro coroado por luz — um evento que quase não acontece.",
     "history_en": "The dark disc crowned by light — an event that scarcely occurs."},
    {"key": "painita",       "name": "Painita",       "max_supply": 2500,    "rarity_weight": 0.06,
     "description_pt": "Inspirada em uma das pedras mais raras do planeta.",
     "description_en": "Inspired by one of the rarest gems on Earth.",
     "history_pt": "Cristal de bordas afiadas, valor sussurrado por poucos.",
     "history_en": "A crystal of sharp edges, value whispered by few."},
    {"key": "apex",          "name": "Apex",          "max_supply": 10000,   "rarity_weight": 0.10,
     "description_pt": "Representa o ponto máximo.",
     "description_en": "Represents the highest point.",
     "history_pt": "A pirâmide perfeita — o topo de qualquer ascensão.",
     "history_en": "The perfect pyramid — the summit of every ascent."},
    {"key": "aureon",        "name": "Aureon",        "max_supply": 25000,   "rarity_weight": 0.14,
     "description_pt": "Inspirada no ouro e no prestígio.",
     "description_en": "Inspired by gold and prestige.",
     "history_pt": "Raios dourados irradiam de um centro imutável.",
     "history_en": "Golden rays radiate from an unchanging center."},
    {"key": "obsidian",      "name": "Obsidian",      "max_supply": 75000,   "rarity_weight": 0.19,
     "description_pt": "Representa força e transformação.",
     "description_en": "Represents strength and transformation.",
     "history_pt": "Vidro vulcânico cortado em monólito. Silencioso, absoluto.",
     "history_en": "Volcanic glass cut into a monolith. Silent, absolute."},
    {"key": "alfalium",      "name": "Alfalium",      "max_supply": 250000,  "rarity_weight": 0.22,
     "description_pt": "Elemento fictício exclusivo da Nexora.",
     "description_en": "A fictional element exclusive to Nexora.",
     "history_pt": "Estrutura molecular impossível fora deste cofre.",
     "history_en": "A molecular structure impossible outside this vault."},
    {"key": "omeguium",      "name": "Omeguium",      "max_supply": 1000000, "rarity_weight": 0.259,
     "description_pt": "A Relic mais comum. Mesmo assim permanece limitada.",
     "description_en": "The most common Relic. Even so, it remains limited.",
     "history_pt": "Geometria pura. A base de toda coleção.",
     "history_en": "Pure geometry. The foundation of every collection."},
]


# ---------- Models ----------
class Relic(BaseModel):
    key: str
    name: str
    max_supply: int
    discovered: int = 0
    description_pt: str
    description_en: str
    history_pt: str
    history_en: str

class RelicSummary(BaseModel):
    key: str
    name: str
    max_supply: int
    discovered: int
    remaining: int

class UserCreate(BaseModel):
    name: str
    city: str
    country: str
    photo_base64: Optional[str] = None

class User(BaseModel):
    id: str
    name: str
    city: str
    country: str
    photo_base64: Optional[str] = None
    invite_code: str
    influence: int = 0
    invites_sent: int = 0
    collector_since: str

class DiscoveryRecord(BaseModel):
    id: str
    user_id: str
    relic_key: str
    relic_name: str
    serial_number: int
    city: str
    country: str
    discovered_at: str

class DiscoverRequest(BaseModel):
    user_id: str

class DiscoverResponse(BaseModel):
    discovery: DiscoveryRecord
    relic: RelicSummary
    is_first_collector: bool

class CollectionItem(BaseModel):
    relic_key: str
    relic_name: str
    count: int
    first_serial: int
    latest_discovered_at: str


# ---------- Startup: seed catalog ----------
async def seed_catalog():
    for r in RELIC_CATALOG:
        existing = await db.relics.find_one({"key": r["key"]}, {"_id": 0})
        if not existing:
            await db.relics.insert_one({
                "key": r["key"],
                "name": r["name"],
                "max_supply": r["max_supply"],
                "discovered": 0,
                "description_pt": r["description_pt"],
                "description_en": r["description_en"],
                "history_pt": r["history_pt"],
                "history_en": r["history_en"],
                "first_collector_id": None,
                "first_collector_name": None,
            })


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "NEXORA API"}

@api_router.get("/relics", response_model=List[Relic])
async def list_relics():
    docs = await db.relics.find({}, {"_id": 0}).to_list(100)
    order = {r["key"]: i for i, r in enumerate(RELIC_CATALOG)}
    docs.sort(key=lambda d: order.get(d.get("key"), 999))
    return [Relic(**{k: d.get(k) for k in Relic.model_fields.keys()}) for d in docs]

@api_router.get("/registry", response_model=List[RelicSummary])
async def world_registry():
    docs = await db.relics.find({}, {"_id": 0}).to_list(100)
    order = {r["key"]: i for i, r in enumerate(RELIC_CATALOG)}
    docs.sort(key=lambda d: order.get(d.get("key"), 999))
    return [
        RelicSummary(
            key=d["key"],
            name=d["name"],
            max_supply=d["max_supply"],
            discovered=d.get("discovered", 0),
            remaining=d["max_supply"] - d.get("discovered", 0),
        )
        for d in docs
    ]

@api_router.get("/relics/{key}")
async def relic_detail(key: str):
    d = await db.relics.find_one({"key": key}, {"_id": 0})
    if not d:
        raise HTTPException(status_code=404, detail="Relic not found")
    d["remaining"] = d["max_supply"] - d.get("discovered", 0)
    return d


def _generate_invite_code() -> str:
    # 8 chars, uppercase alphanumeric (no confusing chars)
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "NX-" + "".join(secrets.choice(alphabet) for _ in range(6))

@api_router.post("/users", response_model=User)
async def create_user(payload: UserCreate):
    uid = str(uuid.uuid4())
    invite_code = _generate_invite_code()
    now = datetime.now(timezone.utc).isoformat()
    user_doc = {
        "id": uid,
        "name": payload.name,
        "city": payload.city,
        "country": payload.country,
        "photo_base64": payload.photo_base64,
        "invite_code": invite_code,
        "influence": 0,
        "invites_sent": 0,
        "collector_since": now,
    }
    await db.users.insert_one(dict(user_doc))
    return User(**user_doc)

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    d = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not d:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**{k: d.get(k) for k in User.model_fields.keys()})


def _weighted_pick(available):
    total = sum(w for _, w in available)
    r = random.random() * total
    upto = 0.0
    for key, w in available:
        upto += w
        if upto >= r:
            return key
    return available[-1][0]

@api_router.post("/discover", response_model=DiscoverResponse)
async def discover(payload: DiscoverRequest):
    user = await db.users.find_one({"id": payload.user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    relics_docs = await db.relics.find({}, {"_id": 0}).to_list(100)
    available = []
    weight_map = {r["key"]: r["rarity_weight"] for r in RELIC_CATALOG}
    for d in relics_docs:
        if d.get("discovered", 0) < d["max_supply"]:
            available.append((d["key"], weight_map.get(d["key"], 0.1)))
    if not available:
        raise HTTPException(status_code=410, detail="All Relics have been discovered.")

    chosen_key = _weighted_pick(available)

    # atomic increment + fetch new count
    updated = await db.relics.find_one_and_update(
        {"key": chosen_key, "$expr": {"$lt": ["$discovered", "$max_supply"]}},
        {"$inc": {"discovered": 1}},
        return_document=True,
        projection={"_id": 0},
    )
    if not updated:
        # race condition — retry recursion once
        return await discover(payload)

    serial = updated["discovered"]
    is_first = serial == 1

    if is_first:
        await db.relics.update_one(
            {"key": chosen_key},
            {"$set": {"first_collector_id": user["id"], "first_collector_name": user["name"]}}
        )

    discovery = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "relic_key": chosen_key,
        "relic_name": updated["name"],
        "serial_number": serial,
        "city": user.get("city", ""),
        "country": user.get("country", ""),
        "discovered_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.discoveries.insert_one(dict(discovery))

    summary = RelicSummary(
        key=chosen_key,
        name=updated["name"],
        max_supply=updated["max_supply"],
        discovered=serial,
        remaining=updated["max_supply"] - serial,
    )
    return DiscoverResponse(
        discovery=DiscoveryRecord(**discovery),
        relic=summary,
        is_first_collector=is_first,
    )

@api_router.get("/users/{user_id}/collection")
async def user_collection(user_id: str):
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$sort": {"discovered_at": 1}},
        {"$group": {
            "_id": "$relic_key",
            "relic_key": {"$first": "$relic_key"},
            "relic_name": {"$first": "$relic_name"},
            "first_serial": {"$first": "$serial_number"},
            "count": {"$sum": 1},
            "latest_discovered_at": {"$last": "$discovered_at"},
        }},
    ]
    items = await db.discoveries.aggregate(pipeline).to_list(1000)
    for it in items:
        it.pop("_id", None)
    order = {r["key"]: i for i, r in enumerate(RELIC_CATALOG)}
    items.sort(key=lambda x: order.get(x.get("relic_key"), 999))
    return items

@api_router.get("/users/{user_id}/discoveries")
async def user_discoveries(user_id: str):
    docs = await db.discoveries.find({"user_id": user_id}, {"_id": 0}).sort("discovered_at", -1).to_list(200)
    return docs

@api_router.get("/users/{user_id}/rarest")
async def user_rarest(user_id: str):
    docs = await db.discoveries.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    if not docs:
        return None
    order = {r["key"]: i for i, r in enumerate(RELIC_CATALOG)}
    docs.sort(key=lambda d: order.get(d.get("relic_key"), 999))
    return docs[0]

@api_router.get("/users/{user_id}/stats")
async def user_stats(user_id: str):
    total = await db.discoveries.count_documents({"user_id": user_id})
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "total_relics": total,
        "influence": user.get("influence", 0),
        "invites_sent": user.get("invites_sent", 0),
        "invite_code": user.get("invite_code"),
        "collector_since": user.get("collector_since"),
    }


app.include_router(api_router)

# Serve generated relic PNGs at /api/relic-images/{key}.png
IMG_DIR = ROOT_DIR / "relic_images"
if IMG_DIR.exists():
    app.mount("/api/relic-images", StaticFiles(directory=str(IMG_DIR)), name="relic-images")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def on_startup():
    await seed_catalog()
    logger.info("NEXORA catalog seeded")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
