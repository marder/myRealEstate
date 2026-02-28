import json
import requests
import time
import random
import os

# Konfiguracja
INPUT_FILE = r'C:\Users\Admin\Documents\myRealEstate\realestate\mienie_gminne_mongodb.json'
OUTPUT_FILE = r'C:\Users\Admin\Documents\myRealEstate\realestate\Mienie_gminne_Geolokalizowane.json'
TEST_LIMIT = 10  # Zmniejszamy na super-szybki test

def get_osm_coords(location_name):
    """Pobiera współrzędne z OSM Nominatim z lepszymi nagłówkami"""
    try:
        query = f"{location_name.strip()}, powiat turecki, Polska"
        url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=1"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'pl,en-US;q=0.7,en;q=0.3'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code != 200:
            print(f"Błąd HTTP {response.status_code} dla {location_name}")
            return None
            
        data = response.json()
        
        if data:
            print(f"Znalazłem {location_name}: {data[0]['lat']}, {data[0]['lon']}")
            return {
                "lat": float(data[0]['lat']),
                "lon": float(data[0]['lon'])
            }
        else:
            print(f"Nominatim nie znalazł: {location_name}")
            return None
    except Exception as e:
        print(f"Wyjątek dla {location_name}: {e}")
        return None

def main():
    print(f"Startujemy...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    test_data = data[:TEST_LIMIT]
    precinct_cache = {}
    results = []

    for entry in test_data:
        p_name = entry.get("Obręb")
        if not p_name: continue
            
        if p_name not in precinct_cache:
            coords = get_osm_coords(p_name)
            precinct_cache[p_name] = coords
            time.sleep(1.5) # Bezpieczna przerwa
            
        base_coords = precinct_cache[p_name]
        
        if base_coords:
            # Małe losowe przesunięcie
            jitter_lat = (random.random() - 0.5) * 0.002
            jitter_lon = (random.random() - 0.5) * 0.002
            entry["geolokalizacja"] = {
                "lat": base_coords["lat"] + jitter_lat,
                "lon": base_coords["lon"] + jitter_lon
            }
        else:
            entry["geolokalizacja"] = None
            
        results.append(entry)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
        
    print(f"\nUkończono. Sprawdź plik {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
