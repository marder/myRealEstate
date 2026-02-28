import json
import requests
import time
import os

# Config
INPUT_FILE = r'C:\Users\Admin\Documents\myRealEstate\realestate\mienie_gminne_mongodb.json'
OUTPUT_FILE = r'C:\Users\Admin\Documents\myRealEstate\realestate\Mienie_gminne_Geolokalizowane.json'
TEST_LIMIT = 50

def get_teryt_for_precinct(precinct_name):
    try:
        url = f"https://uldk.gugik.gov.pl/query.php?request=GetPrecinctsByIdOrName&name={precinct_name}"
        response = requests.get(url, timeout=10)
        text = response.text.strip()
        lines = text.split('\n')
        
        if lines[0] == '0':
            for line in lines[1:]:
                parts = line.split('|')
                if len(parts) >= 2:
                    if precinct_name.lower() in parts[1].lower():
                        return parts[0]
        return None
    except Exception as e:
        print(f"Error searching precinct {precinct_name}: {e}")
        return None

def get_parcel_data(teryt_precinct, parcel_number):
    try:
        parcel_id = f"{teryt_precinct}.{parcel_number}"
        url = f"https://uldk.gugik.gov.pl/query.php?request=GetParcelByIdOrNr&id={parcel_id}&result=geom_wkt,teryt,powierzchnia"
        response = requests.get(url, timeout=10)
        text = response.text.strip()
        lines = text.split('\n')
        
        if lines[0] == '0' and len(lines) > 1:
            parts = lines[1].split('|')
            if len(parts) >= 3:
                return {
                    "wkt": parts[0],
                    "teryt_full": parts[1],
                    "area_gugik": parts[2]
                }
        return None
    except Exception as e:
        print(f"Error searching parcel {parcel_number}: {e}")
        return None

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"File not found: {INPUT_FILE}")
        return

    print(f"Loading data...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    precinct_cache = {}
    results = []
    processed_count = 0
    test_data = data[:TEST_LIMIT]
    
    print(f"Processing {len(test_data)} records...")
    
    for entry in test_data:
        p_name = entry.get("Obręb")
        p_num = entry.get("Numer działki")
        
        if not p_name or not p_num:
            continue
            
        if p_name not in precinct_cache:
            print(f"Finding TERYT for: {p_name}")
            teryt = get_teryt_for_precinct(p_name)
            precinct_cache[p_name] = teryt
            time.sleep(0.3)
            
        teryt_p = precinct_cache[p_name]
        
        if teryt_p:
            info = get_parcel_data(teryt_p, p_num)
            if info:
                entry["geolokalizacja"] = {
                    "wkt": info["wkt"],
                    "teryt": info["teryt_full"],
                    "powierzchnia_gugik": info["area_gugik"],
                    "link": f"https://mapy.geoportal.gov.pl/imap/Imgp_2.html?identifyParcel={info['teryt_full']}"
                }
                processed_count += 1
            else:
                entry["geolokalizacja"] = None
        else:
            entry["geolokalizacja"] = None
            
        results.append(entry)
        status = "OK" if entry["geolokalizacja"] else "FAIL"
        print(f"[{status}] {p_name} {p_num}")
        
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
        
    print(f"Done! Localized: {processed_count}/{len(test_data)}")

if __name__ == "__main__":
    main()
