import { Component, input, viewChild, effect, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-cell',
  imports: [],
  templateUrl: './map-cell.html',
  styleUrl: './map-cell.css',
})
export class MapCell implements AfterViewInit, OnDestroy  {
  data = input<any>();
  geoJson: any;
  
  mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  private map?: L.Map;
  private geoLayer?: L.GeoJSON;

  private updateOnInputChange = effect(() => {
    console.log(this.data())
    this.geoJson = this.data()?.metadata
    this.renderGeoJson();
  })

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private initializeMap() {
    const el =this.mapContainer().nativeElement;
    this.map = L.map(el);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '© OpenStreetMap'}
    ).addTo(this.map);

    this.renderGeoJson();
  }

  private renderGeoJson() {
    if (!this.map) return;
    if (!this.geoJson) return;

    this.geoLayer?.remove();
    this.geoLayer =
      L.geoJSON(this.geoJson, {
        style: () => ({
          color: '#2563eb',
          weight: 2,
          fillOpacity: 0.3
        }),
        onEachFeature:
          (feature, layer) => {
            if (feature.properties) {
              layer.bindPopup(
                Object.entries(feature.properties)
                .map(([k, v]) => `<b>${k}</b>: ${v}`)
                .join('<br>')
              );
            }
          }
      });
    this.geoLayer.addTo(this.map);

    const bounds = this.geoLayer.getBounds();
    if (bounds.isValid()) {
      this.map.fitBounds(
        bounds, { padding: [40, 40] }
      );
    }
  }
}
