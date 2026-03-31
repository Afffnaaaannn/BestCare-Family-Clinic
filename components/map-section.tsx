"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

let L: any = null

const loadLeaflet = async () => {
  if (L) return L
  const leaflet = await import("leaflet")
  L = leaflet.default
  return L
}

const CLINIC_COORDINATES: [number, number] = [33.4902844, 73.0725824]

export function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return
    
    if (mapInstanceRef.current) return

    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return
      
      const leaflet = await loadLeaflet()
      
      await import("leaflet/dist/leaflet.css")

      if ((mapRef.current as any)._leaflet_id) {
        return
      }

      const map = leaflet.map(mapRef.current!, {
        center: CLINIC_COORDINATES,
        zoom: 15,
        scrollWheelZoom: true,
        zoomControl: true,
      })

      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)

      const customIcon = leaflet.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background: #1a5c4c;
            width: 40px;
            height: 40px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid white;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })

      const marker = leaflet.marker(CLINIC_COORDINATES, { icon: customIcon }).addTo(map)

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 8px;">
          <h3 style="font-weight: 600; margin: 0 0 8px 0; font-size: 14px;">The Bestcare Family Clinic</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Shop no - 9, Hub commercial</p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">C Junction Sector C, Phase 8, Rawalpindi</p>
          <p style="margin: 0; font-size: 12px; color: #1a5c4c; font-weight: 500;">Mon-Sat: 6:00 PM - 9:00 PM</p>
        </div>
      `).openPopup()

      mapInstanceRef.current = map
    }

    initializeMap()

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
          if (mapRef.current) {
            delete (mapRef.current as any)._leaflet_id
          }
        } catch (error) {
          console.error('Error cleaning up map:', error)
        }
      }
    }
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm tracking-widest uppercase text-primary font-medium mb-4">
            Find Us
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
            Visit our clinic
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We&apos;re conveniently located in Bahria Town Phase 8, Islamabad. 
            Use the interactive map below to find directions to our clinic.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-2xl hover:border-primary hover:scale-105 transition-all duration-300">
          <div 
            ref={mapRef} 
            className="w-full h-100 lg:h-125 z-0"
          />
          
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm bg-card/95 backdrop-blur-sm border border-border rounded-xl p-5 shadow-xl z-1000">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">The Bestcare Family Clinic</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  ZEM Building, Near Future World School,<br />
                  Bahria Town Phase 8, Islamabad
                </p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${CLINIC_COORDINATES[0]},${CLINIC_COORDINATES[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Instructions */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Drag to pan, scroll or pinch to zoom. Click on the marker for details.
        </p>
      </div>
    </section>
  )
}
