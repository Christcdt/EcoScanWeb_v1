// Carte.jsx
import { useState, useEffect } from 'react'

function Carte({ setPage }) {
  const [userLocation, setUserLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupérer la position GPS de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setLoading(false)
        },
        (err) => {
          setError("")
          setLoading(false)
          console.error("Erreur géolocalisation:", err)
        }
      )
    } else {
      setError("La géolocalisation n'est pas supportée par votre navigateur")
      setLoading(false)
    }
  }, [])

  // Générer l'URL Google Maps avec les déchetteries à proximité
  const getMapUrl = () => {
    if (userLocation) {
      // Recherche des déchetteries autour de la position
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5000!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zRMOpY2hldMOocmll!5e0!3m2!1sfr!2sfr!4v1716135000000!5m2!1sfr!2sfr&q=d%C3%A9chetterie`
    }
    // Vue par défaut de Sainte-Clotilde
    return "https://www.google.com/maps/d/u/0/embed?mid=19KITcnwWC0R1gTmlu0-Hg7nMn6kUczw&ehbc=2E312F&noprof=1"
  }

  // Déchetteries à Sainte-Clotilde
  const dechetteries = [
    {
      id: 1,
      nom: "Déchèterie de Sainte-Clotilde",
      adresse: "Rue des Artisans, ZAC Les Sables, 97490 Sainte-Clotilde",
      lat: -20.8890089,
      lng: 55.4681181,
      horaires: "Lundi au Samedi: 8h-17h, Dimanche: 8h-12h",
      type: "🗑️"
    },
    {
      id: 2,
      nom: "Déchèterie De La Bretagne",
      adresse: "La Bretagne, 97490 Sainte-Clotilde",
      lat: -20.8850000,
      lng: 55.4700000,
      horaires: "Lundi au Vendredi: 8h-16h, Samedi: 8h-12h",
      type: "🗑️"
    },
    {
      id: 3,
      nom: "Déchèterie Cité Hyacinthe",
      adresse: "Cité Hyacinthe, 97490 Sainte-Clotilde",
      lat: -20.8920000,
      lng: 55.4650000,
      horaires: "Mardi au Samedi: 8h-17h",
      type: "🗑️"
    },
    {
      id: 4,
      nom: "Borne à verre - Super U",
      adresse: "Centre Commercial, 2 Rue des Peupliers, 97490 Sainte-Clotilde",
      lat: -20.8912345,
      lng: 55.4700000,
      horaires: "Accès 24h/24",
      type: "🍾"
    },
    {
      id: 5,
      nom: "Borne à verre - Leader Price",
      adresse: "47 Rue du General De Gaulle, 97490 Sainte-Clotilde",
      lat: -20.8876543,
      lng: 55.4650000,
      horaires: "Accès 24h/24",
      type: "🍾"
    },
    {
      id: 6,
      nom: "Point de collecte piles",
      adresse: "Pharmacie du centre, 15 Rue de la République",
      lat: -20.8901234,
      lng: 55.4665000,
      horaires: "Lundi au Samedi: 9h-19h",
      type: "🔋"
    }
  ]

  // Calculer la distance entre deux points GPS
  const calculerDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Trier les déchetteries par distance si position connue
  const dechetteriesTriees = userLocation 
    ? [...dechetteries].sort((a, b) => 
        calculerDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) - 
        calculerDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
      )
    : dechetteries

  // Ouvrir l'itinéraire vers une déchetterie
  const ouvrirItineraire = (lat, lng, nom) => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}/`, '_blank')
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4fff6" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "20px", color: "#1b8f3f" }}>📍 Récupération de votre position...</p>
          <p style={{ color: "#666" }}>Veuillez autoriser l'accès à votre position</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f4fff6", 
      fontFamily: "Arial", 
      display: "flex", 
      justifyContent: "center", 
      padding: "20px" 
    }}>
      <div style={{ maxWidth: "1400px", width: "90%" }}>
        
        <button 
          onClick={() => setPage('accueil')}
          style={{
            backgroundColor: "#2bbf59",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Retour à l'accueil
        </button>
        
        <h1 style={{ color: "#1b8f3f", textAlign: "center", marginBottom: "20px" }}>
          🗺️ Déchetteries à proximité 
        </h1>

        {userLocation && (
          <div style={{
            backgroundColor: "#e8fff0",
            borderRadius: "15px",
            padding: "10px",
            marginBottom: "15px",
            textAlign: "center"
          }}>
            <p style={{ color: "#1b8f3f", margin: 0 }}>
              📍 Votre position a été détectée
            </p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: "#ffe0e0",
            borderRadius: "15px",
            padding: "10px",
            marginBottom: "15px",
            textAlign: "center"
          }}>
            <p style={{ color: "#d32f2f", margin: 0 }}>
              ⚠️ {error}
            </p>
          </div>
        )}
        
        {/* Carte Google Maps avec géolocalisation */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "10px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}>
          <iframe 
            src={getMapUrl()}
            width="100%" 
            height="500"
            style={{ border: 0, borderRadius: "15px" }}
            allowFullScreen=""
            loading="lazy"
            title="Carte des déchetteries"
          ></iframe>
        </div>
        
        {/* Liste des déchetteries par ordre de proximité */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "20px",
          marginTop: "20px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}>
          <h2 style={{ color: "#1b8f3f", marginBottom: "15px" }}>
            📍 Points de collecte à proximité
            {userLocation && <span style={{ fontSize: "14px", marginLeft: "10px" }}>(par ordre de proximité)</span>}
          </h2>
          
          {dechetteriesTriees.map((point, index) => (
            <div 
              key={point.id}
              onClick={() => ouvrirItineraire(point.lat, point.lng, point.nom)}
              style={{ 
                padding: "15px", 
                borderBottom: index !== dechetteriesTriees.length - 1 ? "1px solid #e0e0e0" : "none",
                display: "flex", 
                alignItems: "center", 
                gap: "15px",
                cursor: "pointer",
                transition: "background-color 0.2s",
                borderRadius: "10px",
                backgroundColor: index === 0 && userLocation ? "#d7f5df" : "transparent"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
              onMouseLeave={(e) => {
                if (index !== 0 || !userLocation) {
                  e.currentTarget.style.backgroundColor = "transparent"
                }
              }}
            >
              <span style={{ fontSize: "32px" }}>{point.type}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <strong style={{ color: "#1b8f3f", fontSize: "16px" }}>{point.nom}</strong>
                  {userLocation && (
                    <span style={{ 
                      backgroundColor: "#2bbf59", 
                      color: "white", 
                      padding: "2px 8px", 
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}>
                      À {calculerDistance(userLocation.lat, userLocation.lng, point.lat, point.lng).toFixed(1)} km
                    </span>
                  )}
                  {index === 0 && userLocation && (
                    <span style={{ 
                      backgroundColor: "#ff9800", 
                      color: "white", 
                      padding: "2px 8px", 
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "bold"
                    }}>
                      🌟 Le plus proche
                    </span>
                  )}
                </div>
                <small style={{ color: "#666", display: "block", marginTop: "5px" }}>
                  📍 {point.adresse}
                </small>
                <small style={{ color: "#888", fontSize: "12px", display: "block", marginTop: "3px" }}>
                  🕐 {point.horaires}
                </small>
              </div>
              <span style={{ fontSize: "20px", color: "#2bbf59" }}>🚗</span>
            </div>
          ))}
        </div>
        
        {/* Information */}
        <div style={{
          backgroundColor: "#e8fff0",
          borderRadius: "20px",
          padding: "15px",
          marginTop: "20px",
          textAlign: "center",
        }}>
          <p style={{ color: "#1b8f3f", margin: 0 }}>
            📌 Cliquez sur un point de collecte pour obtenir l'itinéraire depuis votre position
          </p>
          <p style={{ color: "#666", margin: "10px 0 0 0", fontSize: "14px" }}>
            🚗 Les distances sont calculées à vol d'oiseau - L'itinéraire réel peut varier
          </p>
        </div>

        {/* Footer simplifié */}
<footer style={{
  marginTop: "60px",
  padding: "30px 20px",
  backgroundColor: "white",
  borderRadius: "20px",
  textAlign: "center",
  border: "1px solid #d7f5df"
}}>
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "20px"
  }}>
    <img 
      src="/bacs/logocp-re.png" 
      alt="Logo" 
      style={{ height: "60px", width: "auto" }} 
    />
    <div>
      <h3 style={{ color: "#1b8f3f", margin: 0 }}>ÉcoScan</h3>
      <p style={{ color: "#666", margin: "5px 0 0 0", fontSize: "12px" }}>Tri Intelligent des Déchets</p>
    </div>
  </div>

  <p style={{ color: "#666", fontSize: "14px", margin: "10px 0" }}>
    Créé par <strong style={{ color: "#1b8f3f" }}>EcologIA</strong>
  </p>

  <p style={{ color: "#999", fontSize: "12px", marginTop: "15px" }}>
    © 2026 ÉcoScan - Python de la fournaise
  </p>
</footer>
      </div>
    </div>
  )
}

export default Carte