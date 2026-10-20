import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath("backend"))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("--- Testing /health ---")
r = client.get("/health")
print("Status:", r.status_code, r.json())
assert r.status_code == 200

print("\n--- Testing /options ---")
r = client.get("/options")
print("Status:", r.status_code)
data = r.json()
print("Top 10 countries:", data["top_10_countries"])
print("Genders:", data["genders"])
print("Platforms count:", len(data["platforms"]))
print("Score bounds:", data["score_bounds"])
assert len(data["platforms"]) > 0

print("\n--- Testing /predict ---")
payload = {
    "Age": 21,
    "Gender": "Female",
    "Country": "USA",
    "Academic_Level": "Undergraduate",
    "Most_Used_Platform": "Instagram",
    "Purpose_Of_Use": "Entertainment",
    "Avg_Daily_Usage_Hours": 6.5,
    "Daily_Unlocks": 95,
    "Study_Hours": 4.0,
    "Physical_Activity_Hours": 0.5,
    "Sleep_Hours_Per_Night": 5.5,
    "Stress_Level": "High"
}
r = client.post("/predict", json=payload)
print("Status:", r.status_code)
pred = r.json()
print("Prediction Result:")
import json
print(json.dumps(pred, indent=2))
assert "score" in pred
assert "band" in pred
assert len(pred["top_factors"]) > 0

print("\n--- Testing /whatif ---")
whatif_payload = {
    "baseline": payload,
    "Avg_Daily_Usage_Hours": 2.5,
    "Sleep_Hours_Per_Night": 8.0,
    "Physical_Activity_Hours": 1.5,
    "Stress_Level": "Low"
}
r = client.post("/whatif", json=whatif_payload)
print("Status:", r.status_code)
whatif_res = r.json()
print(f"Baseline Score: {whatif_res['baseline_score']} -> Simulated Score: {whatif_res['predicted_score']} (Delta: {whatif_res['delta']:+})")

print("\n--- Testing /insights ---")
r = client.get("/insights")
print("Status:", r.status_code)
insights = r.json()
print("Key stats:", insights["key_stats"])
print("Histogram bins count:", len(insights["score_distribution"]))
print("Stress groups count:", len(insights["score_by_stress"]))

print("\n--- Testing /model-card ---")
r = client.get("/model-card")
print("Status:", r.status_code)
mc = r.json()
print("Model comparison rows:", len(mc.get("comparison", [])))

print("\nALL BACKEND ENDPOINTS PASSED SUCCESSFULLY!")
