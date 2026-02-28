<script setup>
import { onMounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  // Środek mapy (domyślnie gmina Dobra/Turek)
  center: {
    type: Array,
    default: () => [51.91, 18.61] 
  },
  zoom: {
    type: Number,
    default: 13
  },
  // Opcjonalny punkt do zaznaczenia (np. kliknięta działka)
  selectedPoint: {
    type: Object,
    default: null
  }
});

const mapContainer = ref(null);
let map = null;
let marker = null;

onMounted(() => {
  // 1. Inicjalizacja mapy
  map = L.map(mapContainer.value).setView(props.center, props.zoom);

  // 2. Warstwa podstawowa (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // 3. Warstwa GEOPORTALU (WMS) - Granice działek i numery
  // Ta warstwa jest przezroczysta i nakłada się na OSM
  const wmsLayer = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/PZGIK/EwidencjaGruntowIBudynkow/WMS/MapaEwidencji', {
    layers: 'dzialki,numery_dzialek',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: 'Główny Urząd Geodezji i Kartografii'
  }).addTo(map);

  console.log("Mapa Leaflet z warstwą WMS GUGiK zainicjalizowana.");
});

// Reagowanie na zmianę wybranego punktu (centrowanie mapy)
watch(() => props.selectedPoint, (newPoint) => {
  if (newPoint && map) {
    const coords = [newPoint.lat, newPoint.lon];
    map.setView(coords, 18); // Duży zoom, żeby zobaczyć działkę

    if (marker) map.removeLayer(marker);
    marker = L.marker(coords).addTo(map)
      .bindPopup(`<b>Działka nr: ${newPoint.label}</b>`)
      .openPopup();
  }
});
</script>

<template>
  <div class="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
    <div ref="mapContainer" class="w-full h-full z-10"></div>
    <div class="absolute bottom-4 left-4 z-20 bg-white/90 p-2 rounded-lg text-[10px] font-bold shadow-md">
      Warstwa: Ewidencja Gruntów (GUGiK)
    </div>
  </div>
</template>

<style>
/* Naprawa ikon Leaflet (częsty problem w Vue/Vite) */
.leaflet-default-icon-path {
  background-image: url(https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png);
}
</style>
