<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Wicket from 'wicket';

const props = defineProps({
  center: {
    type: Array,
    default: () => [51.91, 18.61] 
  },
  zoom: {
    type: Number,
    default: 13
  },
  selectedParcel: {
    type: Object,
    default: null
  },
  allParcels: {
    type: Array,
    default: () => []
  }
});

const mapContainer = ref(null);
let map = null;
let parcelLayer = null; 
let allParcelsLayer = null; 

const activeLayer = ref('standard'); 

let osmLayer = null;
let orthoLayer = null;
let wmsLayer = null;

const drawWkt = (wktString, style) => {
  try {
    const wkt = new Wicket.Wkt();
    wkt.read(wktString);
    const geojson = wkt.toJson();
    return L.geoJSON(geojson, { style });
  } catch (e) {
    console.error("WKT drawing error:", e);
    return null;
  }
};

const updateSelectedParcel = (parcel) => {
  if (!parcel || !map || !parcel.wkt) return;
  
  if (parcelLayer) map.removeLayer(parcelLayer);
  
  // Rysujemy obrys działki na podstawie jej geometrii WKT
  parcelLayer = drawWkt(parcel.wkt, {
    color: '#4f46e5',
    weight: 4,
    opacity: 1,
    fillColor: '#4f46e5',
    fillOpacity: 0.3,
    dashArray: '5, 10',
    interactive: false // Wyłączamy interaktywność, aby uniknąć ramki focusu
  });

  if (parcelLayer) {
    parcelLayer.addTo(map);
    // Używamy setTimeout, aby upewnić się, że kontener mapy ma już swoje wymiary
    setTimeout(() => {
        const bounds = parcelLayer.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
        }
        
        const popupContent = `
          <div class="p-2 min-w-[150px]">
              <div class="text-[10px] font-black uppercase text-indigo-600 mb-1">Wybrany obiekt</div>
              <div class="text-lg font-black text-slate-900 mb-2">${parcel.name || parcel.numerDzialki || 'Działka'}</div>
              <div class="text-[9px] font-bold text-slate-400 mb-2 uppercase">${parcel.uzytki || parcel.obreb || ''}</div>
              <div class="text-[10px] font-mono text-slate-400 break-all bg-slate-50 p-2 rounded-lg border border-slate-100">${parcel.id}</div>
          </div>
        `;
        parcelLayer.bindPopup(popupContent, { className: 'custom-popup' }).openPopup();
    }, 100);
  }
};

onMounted(() => {
  map = L.map(mapContainer.value, {
    zoomControl: false 
  }).setView(props.center, props.zoom);
  
  L.control.zoom({
    position: 'bottomright'
  }).addTo(map);

  osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  orthoLayer = L.tileLayer('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMTS/StandardResolution?service=WMTS&request=GetTile&version=1.0.0&layer=StandardResolution&style=default&tilematrixset=EPSG:3857&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/jpeg', {
    attribution: 'GUGiK',
    maxZoom: 21,
    maxNativeZoom: 19
  });

  map.createPane('overlayPaneTop');
  map.getPane('overlayPaneTop').style.zIndex = 650;
  map.getPane('overlayPaneTop').style.pointerEvents = 'none';

  wmsLayer = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/PZGIK/EwidencjaGruntowIBudynkow/WMS/MapaEwidencji', {
    layers: 'dzialki,numery_dzialek',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: 'GUGiK',
    pane: 'overlayPaneTop'
  }).addTo(map);

  // Inicjalne rysowanie, jeśli propsy już są
  if (props.selectedParcel) {
    updateSelectedParcel(props.selectedParcel);
  }
  
  if (props.allParcels.length > 0) {
    updateAllParcels(props.allParcels);
  }
});

const setLayer = (type) => {
    activeLayer.value = type;
    if (type === 'ortho') {
        if (map.hasLayer(osmLayer)) map.removeLayer(osmLayer);
        orthoLayer.addTo(map);
    } else {
        if (map.hasLayer(orthoLayer)) map.removeLayer(orthoLayer);
        osmLayer.addTo(map);
    }
    if (wmsLayer) wmsLayer.bringToFront();
};

const emit = defineEmits(['parcel-selected']);

const updateAllParcels = (parcels) => {
    if (!map) return;
    if (allParcelsLayer) map.removeLayer(allParcelsLayer);
    
    allParcelsLayer = L.featureGroup();
    
    parcels.forEach(p => {
      if (p.wkt) {
        const color = getCategoryColor(p.uzytki);
        const layer = drawWkt(p.wkt, {
          color: color,
          weight: 1.5,
          opacity: 0.8,
          fillColor: color,
          fillOpacity: 0.15,
          interactive: true
        });
        if (layer) {
          layer.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            emit('parcel-selected', p);
          });

          layer.bindTooltip(`
            <div class="p-1">
                <div class="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">${p.obreb}</div>
                <div class="text-sm font-bold text-slate-800">dz. ${p.numerDzialki}</div>
                <div class="text-[9px] font-bold text-indigo-500 mt-1 uppercase">${p.uzytki || ''}</div>
            </div>
          `, { sticky: true, className: 'custom-tooltip' });
          allParcelsLayer.addLayer(layer);
        }
      }
    });
    
    allParcelsLayer.addTo(map);
};

const getCategoryColor = (uzytki) => {
  if (!uzytki) return '#ef4444';
  const u = uzytki.toUpperCase();
  if (u.includes('DR')) return '#64748b'; // Drogi
  if (u.includes('BI')) return '#8b5cf6'; // Inne zabudowane
  if (u.startsWith('B')) return '#ef4444'; // Mieszkaniowe
  if (u.startsWith('R')) return '#f59e0b'; // Rolne
  if (u.startsWith('PS')) return '#10b981'; // Pastwiska
  if (u.startsWith('LS')) return '#166534'; // Lasy
  if (u.startsWith('W')) return '#0ea5e9'; // Wody
  return '#ef4444';
};

const refreshSize = () => {
  if (map) {
    map.invalidateSize();
  }
};

defineExpose({
  refreshSize
});

watch(() => props.allParcels, (newParcels) => {
  updateAllParcels(newParcels);
}, { deep: true });

watch(() => props.selectedParcel, (parcel) => {
  updateSelectedParcel(parcel);
}, { deep: true });
</script>

<template>
  <div class="relative w-full h-full group">
    <div ref="mapContainer" class="w-full h-full z-10 bg-slate-50"></div>
    
    <!-- Custom Controls Overlay -->
    <div class="absolute top-6 right-6 z-30 flex flex-col gap-2">
        <div class="bg-white/90 backdrop-blur p-1.5 rounded-2xl shadow-2xl border border-slate-100 flex flex-col gap-1">
            <button 
                @click="setLayer('standard')"
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                :class="activeLayer === 'standard' ? 'bg-portalAccent text-white shadow-lg shadow-red-200' : 'text-slate-400 hover:bg-slate-50'"
                title="Mapa Standardowa"
            >
                <i class="pi pi-map"></i>
            </button>
            <button 
                @click="setLayer('ortho')"
                class="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                :class="activeLayer === 'ortho' ? 'bg-portalAccent text-white shadow-lg shadow-red-200' : 'text-slate-400 hover:bg-slate-50'"
                title="Satelita (Ortofotomapa)"
            >
                <i class="pi pi-images"></i>
            </button>
        </div>
    </div>

    <!-- Data Source Badge -->
    <div class="absolute bottom-6 left-6 z-30 pointer-events-none flex flex-col gap-2">
        <div class="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 w-fit">
            <div class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
            <span class="text-[9px] font-black text-white uppercase tracking-widest opacity-80">Live Data</span>
        </div>
        <div class="bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-white/10 shadow-2xl flex items-center gap-3 w-fit">
            <div class="flex -space-x-2">
                <div class="w-5 h-5 rounded-full bg-red-500 border-2 border-slate-900"></div>
                <div class="w-5 h-5 rounded-full bg-blue-500 border-2 border-slate-900"></div>
            </div>
            <span class="text-[9px] font-black text-white uppercase tracking-widest opacity-80">GUGiK / EGiB</span>
        </div>
    </div>

    <!-- Map Legend -->
    <div class="absolute bottom-6 right-6 z-30">
        <div class="bg-white/90 backdrop-blur p-4 rounded-3xl shadow-2xl border border-slate-100 min-w-[140px]">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Legenda</h4>
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                    <span class="text-[10px] font-bold text-slate-600 uppercase">Mieszkaniowe (B)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#64748b]"></div>
                    <span class="text-[10px] font-bold text-slate-600 uppercase">Drogi (DR)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                    <span class="text-[10px] font-bold text-slate-600 uppercase">Zabudowane (BI)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                    <span class="text-[10px] font-bold text-slate-600 uppercase">Rolne (R)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#10b981]"></div>
                    <span class="text-[10px] font-bold text-slate-600 uppercase">Pastwiska (Ps)</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#166534]"></div>
                    <span class="text-[10px] font-bold text-slate-600 uppercase">Lasy (Ls)</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style>
/* Leaflet Customizations */
.leaflet-container {
    font-family: 'Outfit', sans-serif !important;
}

.custom-tooltip {
    background: white !important;
    border: none !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
    border-radius: 12px !important;
    padding: 8px 12px !important;
}

.custom-tooltip::before {
    display: none !important;
}

.custom-popup .leaflet-popup-content-wrapper {
    border-radius: 20px !important;
    padding: 8px !important;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important;
}

.custom-popup .leaflet-popup-tip {
    box-shadow: 0 20px 50px rgba(0,0,0,0.15) !important;
}

.leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
}

.leaflet-control-zoom a {
    background-color: rgba(255,255,255,0.9) !important;
    color: #1e293b !important;
    width: 40px !important;
    height: 40px !important;
    line-height: 40px !important;
    font-weight: bold !important;
    transition: all 0.2s !important;
}

.leaflet-control-zoom-in {
    border-radius: 12px 12px 0 0 !important;
    border-bottom: 1px solid #f1f5f9 !important;
}

.leaflet-control-zoom-out {
    border-radius: 0 0 12px 12px !important;
}

.leaflet-control-zoom a:hover {
    background-color: #ffffff !important;
    color: #ef4444 !important;
}

/* Remove ugly focus rectangle from SVG paths */
path.leaflet-interactive:focus {
    outline: none !important;
}

svg g path {
    outline: none !important;
}
</style>
