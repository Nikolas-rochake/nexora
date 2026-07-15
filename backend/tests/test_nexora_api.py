"""NEXORA backend API regression tests."""
import re
import pytest

EXPECTED_CATALOG = [
    ("genesis", 1),
    ("aeternum", 10),
    ("constellation", 100),
    ("eclipse", 500),
    ("painita", 2500),
    ("apex", 10000),
    ("aureon", 25000),
    ("obsidian", 75000),
    ("alfalium", 250000),
    ("omeguium", 1000000),
]


# --- Catalog ---
class TestCatalog:
    def test_list_relics(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/relics")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 10
        for i, (k, m) in enumerate(EXPECTED_CATALOG):
            assert data[i]["key"] == k
            assert data[i]["max_supply"] == m
            assert "description_pt" in data[i] and "description_en" in data[i]

    def test_registry(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/registry")
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 10
        for i, (k, m) in enumerate(EXPECTED_CATALOG):
            assert data[i]["key"] == k
            assert data[i]["max_supply"] == m
            assert data[i]["remaining"] == m - data[i]["discovered"]

    def test_relic_detail(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/relics/aureon")
        assert r.status_code == 200
        d = r.json()
        assert d["key"] == "aureon"
        assert d["max_supply"] == 25000
        assert "remaining" in d

    def test_relic_detail_404(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/relics/doesnotexist")
        assert r.status_code == 404


# --- Users ---
class TestUsers:
    def test_create_and_get_user(self, api_client, base_url):
        payload = {"name": "TEST_Ada", "city": "Lisbon", "country": "Portugal"}
        r = api_client.post(f"{base_url}/api/users", json=payload)
        assert r.status_code == 200, r.text
        u = r.json()
        assert u["name"] == "TEST_Ada"
        assert re.match(r"^NX-[A-Z0-9]{6}$", u["invite_code"])
        # ISO datetime
        assert "T" in u["collector_since"]
        uid = u["id"]

        # GET
        g = api_client.get(f"{base_url}/api/users/{uid}")
        assert g.status_code == 200
        assert g.json()["id"] == uid

    def test_get_user_404(self, api_client, base_url):
        r = api_client.get(f"{base_url}/api/users/nonexistent-id-xxx")
        assert r.status_code == 404


# --- Discovery flow ---
@pytest.fixture(scope="module")
def test_user(base_url):
    import requests
    r = requests.post(f"{base_url}/api/users", json={"name": "TEST_Discoverer", "city": "Porto", "country": "Portugal"})
    assert r.status_code == 200
    return r.json()


class TestDiscovery:
    def test_discover_creates_record(self, api_client, base_url, test_user):
        r = api_client.post(f"{base_url}/api/discover", json={"user_id": test_user["id"]})
        assert r.status_code == 200, r.text
        d = r.json()
        assert "discovery" in d and "relic" in d and "is_first_collector" in d
        assert d["discovery"]["serial_number"] >= 1
        assert d["relic"]["remaining"] == d["relic"]["max_supply"] - d["relic"]["discovered"]
        assert d["discovery"]["user_id"] == test_user["id"]

    def test_multiple_discoveries_never_exceed_genesis(self, api_client, base_url, test_user):
        # Do several discoveries and check registry: genesis discovered <= 1
        for _ in range(5):
            api_client.post(f"{base_url}/api/discover", json={"user_id": test_user["id"]})
        reg = api_client.get(f"{base_url}/api/registry").json()
        genesis = next(x for x in reg if x["key"] == "genesis")
        assert genesis["discovered"] <= 1
        assert genesis["remaining"] >= 0
        for row in reg:
            assert row["discovered"] <= row["max_supply"]

    def test_discover_invalid_user(self, api_client, base_url):
        r = api_client.post(f"{base_url}/api/discover", json={"user_id": "nope"})
        assert r.status_code == 404


# --- Collection / stats / rarest ---
class TestUserData:
    def test_collection_grouped(self, api_client, base_url, test_user):
        r = api_client.get(f"{base_url}/api/users/{test_user['id']}/collection")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 1
        item = items[0]
        for k in ["relic_key", "relic_name", "count", "first_serial", "latest_discovered_at"]:
            assert k in item
        assert item["count"] >= 1

    def test_stats(self, api_client, base_url, test_user):
        r = api_client.get(f"{base_url}/api/users/{test_user['id']}/stats")
        assert r.status_code == 200
        s = r.json()
        assert s["total_relics"] >= 1
        assert s["invite_code"] == test_user["invite_code"]
        assert s["collector_since"] == test_user["collector_since"]

    def test_rarest(self, api_client, base_url, test_user):
        r = api_client.get(f"{base_url}/api/users/{test_user['id']}/rarest")
        assert r.status_code == 200
        d = r.json()
        assert d is not None
        assert "relic_key" in d and "serial_number" in d
