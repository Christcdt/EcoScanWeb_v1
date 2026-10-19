import { useState, useEffect } from "react"
import * as tmImage from "@teachablemachine/image"
import Carte from './Carte'

function App() {
  //const navigate = useNavigate()

  const [page, setPage] = useState('accueil')

  const [model, setModel] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [prediction, setPrediction] = useState("")
  const [searchText, setSearchText] = useState("") 
  const [textPrediction, setTextPrediction] = useState("") 

  const dictionnaire = {
    // Bouteille plastique
    "bouteille": "Bouteille plastique",
    "bouteille plastique": "Bouteille plastique",
    "plastique": "Bouteille plastique",
    "bouchon": "Bouteille plastique",
    
    // Carton
    "carton": "Carton",
    "cartons": "Carton",
    "papier": "Carton",
    "journal": "Carton",
    "magazine": "Carton",
    
    // Canette
    "canette": "Canette",
    "canettes": "Canette",
    "cannette": "Canette",
    "boîte": "Canette",
    "boite": "Canette",
    "metal": "Canette",
    
    // Pile
    "pile": "Pile",
    "piles": "Pile",
    "batterie": "Pile",
    "batteries": "Pile",
    "accumulateur": "Pile",
    
    // Verre
    "verre": "Verre",
    "bouteille verre": "Verre",
    "pot": "Verre",
    "bocal": "Verre",
    
    // Electronique
    "ordinateur": "Electronique",
    "pc": "Electronique",
    "écran": "Electronique",
    "tv": "Electronique",
    "téléphone": "Electronique",
    "smartphone": "Electronique",
    "tablette": "Electronique",
    "clavier": "Electronique",
    "souris": "Electronique",
    "imprimante": "Electronique",
    "chargeur": "Electronique",
    "câble": "Electronique",
    "cable": "Electronique",
    "appareil photo": "Electronique",
    "console": "Electronique",
    
    // Restes alimentaires
    "nourriture": "Restes alimentaires",
    "aliment": "Restes alimentaires",
    "restes": "Restes alimentaires",
    "épluchure": "Restes alimentaires",
    "peau": "Restes alimentaires",
    "fruit": "Restes alimentaires",
    "légume": "Restes alimentaires",
    "repas": "Restes alimentaires",
    "déchet alimentaire": "Restes alimentaires",
  }

  const rechercherTexte = (text) => {
    if (!text.trim()) {
      setTextPrediction("")
      return
    }

    const searchLower = text.toLowerCase().trim()
    
    // Recherche exacte
    if (dictionnaire[searchLower]) {
      setTextPrediction(dictionnaire[searchLower])
      return
    }
    
    // Recherche partielle (si le mot est contenu dans une clé)
    for (const [key, value] of Object.entries(dictionnaire)) {
      if (searchLower.includes(key) || key.includes(searchLower)) {
        foundCategory= value
        break
      }
    }
    
    // Aucun résultat
    setTextPrediction("Non trouvé")
  }
  

  // Gérer la recherche quand l'utilisateur tape
  const handleTextSearch = (e) => {
    const text = e.target.value
    setSearchText(text)
    rechercherTexte(text)
  }

  // Réinitialiser la recherche IA quand on utilise la recherche texte
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Optionnel : déclencher une action spéciale
      console.log("Recherche:", searchText)
    }
  }

  console.log("État page actuel:", page)

  const infosBac = {
  "Bouteille plastique": {
    nom: "Bac jaune ♻️",
    image: "/bacs/jaune.png",
    conseil: "La bouteille plastique va dans le bac jaune",
  },

  Carton: {
    nom: "Bac jaune ♻️",
    image: "/bacs/jaune.png",
    conseil: "Le carton se recycle dans le bac jaune",
  },

  Canette: {
    nom: "Bac jaune ♻️",
    image: "/bacs/jaune.png",
    conseil: "Les canettes métalliques vont dans le bac jaune",
  },

  Pile: {
    nom: "Collecte piles 🔋",
    image: "/bacs/pile.png",
    conseil: "Les piles doivent être déposées en point de collecte",
  },

  Verre: {
    nom: "Borne à verre 🍾",
    image: "/bacs/verre.webp",
    conseil: "Le verre doit être déposé dans la borne à verre",
  },

  Electronique: {
    nom: "Déchèterie 🏭",
    image: "/bacs/decheterie.jpg",
    conseil: "Les déchets électroniques vont à la déchèterie",
  },

  "Restes alimentaires":{
    nom: "Bac vert",
    image:"/bacs/vert.png",
    conseil: "Les déchets alimentaires vont dans le bac vert"
  }, 
}

  useEffect(() => {
    async function loadModel() {
      const modelURL = "/model/model.json"
      const metadataURL = "/model/metadata.json"

      const loadedModel = await tmImage.load(
        modelURL,
        metadataURL
      )

      setModel(loadedModel)
    }

    loadModel()
  }, [])

  async function handleImageUpload(event) {
    const file = event.target.files[0]

    if (!file || !model) return

    const imageUrl = URL.createObjectURL(file)
    setImageURL(imageUrl)

    const img = document.createElement("img")
    img.src = imageUrl

    img.onload = async () => {
      const predictions = await model.predict(img)

      predictions.sort(
        (a, b) => b.probability - a.probability
      )

      const bestPrediction = predictions[0]

      setPrediction(
        `${bestPrediction.className} (${(
          bestPrediction.probability * 100
        ).toFixed(1)}%)`
      )
    }
  }

 if (page === 'carte') {
    console.log("On affiche la carte")
    return <Carte setPage={setPage} />
  }

  // Affichage de l'accueil
  console.log("On affiche l'accueil")

  const currentPrediction = textPrediction || prediction
  const isTextSearch = !!textPrediction && !prediction

  return (
  <div
    style={{
      minHeight: "100vh",
      width:"100%",
      paddingLeft:"150px",
      backgroundColor: "#f4fff6",
      paddingTop:"10 px",
      fontFamily: "Arial",
      alignItems:"center",
    }}
  >
    <div
      style={{
        maxWidth: "1400px",
        width:"90%",
        paddingTop:"10px",
        
        position:"relative",
      }}
    >
      
      {/* Logo en haut à gauche */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 10,
          }}
        >
          <img
            src="/bacs/logocp-re.png" // Remplacez par le chemin de votre logo
            alt="Logo"
            style={{
              height: "150px",
              width: "auto",
            }}
          />
        </div>
      <div style={{ paddingTop: "40px" }}></div>
      <h1
        style={{
          textAlign: "center",
          color: "#1b8f3f",
          fontSize: "42px",
          marginBottom: "10px",
        }}
      >
         EcoScan
      </h1>
      
      <div
  s yle={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    gap: "20px",
    flexWrap: "wrap",
  }}
></div>
      <div style={{ width: "120px" }} /> {/* Espace vide pour équilibrer */}
      <p
  style={{
    textAlign: "center",
    color: "#666",
    marginBottom: "40px",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  }}
>
  Importe une photo pour identifier automatiquement le déchet
  <div
  style={{
    display: "flex",
    justifyContent: "flex-end",  // Pousse le contenu à droite
    alignItems: "center",
    marginLeft: "800px",
    marginBottom:"-30px",
  }}
  ></div>

  <div style={{ textAlign: "center", marginBottom: "0px" }}>
  {/* Logo de l'association */}
  <img 
    src="/bacs/logo_asso.png" 
    alt="Logo Association ÉcoScan" 
    style={{ 
      height: "150px", 
      width: "auto",
      display: "flex",
      margin: "0 auto 10px auto",
      paddingBottom:"10px",
      marginTop:"-160px",
      
    }} 
  />
  
  
  <button
    onClick={() => {
      setPage('carte')
      console.log("Bouton cliqué, passage à la carte")
      console.log("La page a changé, nouvelle valeur:", page)
    }}
    
    style={{
      backgroundColor: "#2bbf59",
      color: "white",
      border: "none",
      padding: "10px 20px",
      paddingLeft:"20px",
      borderRadius: "25px",
      fontSize: "14px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "transform 0.2s, background-color 0.2s",
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.05)";
      e.target.style.backgroundColor = "#1d8f3f";
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1)";
      e.target.style.backgroundColor = "#2bbf59";
    }}
  >
    Voir les centres de tri a proximité
  </button>
  </div>
</p>
    
      <div
        style={{
          border: "3px dashed #2bbf59",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          backgroundColor: "#f8fff9",
          marginBottom: "40px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
              backgroundImage: 'url("/bacs/upload.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              width: '120px',
              height: '120px',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              margin: '0 auto',
              display: 'block', 
              color:"transparent",
        }}
        />
        

        <p
          style={{
            marginTop: "15px",
            color: "#666",
          }}
        >
          Clique pour importer une image : jpg,png
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
        }}
      >
        {/* IMAGE */}
        <div
          style={{
            backgroundColor: "#f8fff9",
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid #d7f5df",
          }}
        >
          <h2
            style={{
              color: "#1b8f3f",
              marginBottom: "20px",
            }}
          >
            📷 Aperçu
          </h2>

          {imageURL ? (
            <img
              src={imageURL}
              alt="preview"
              style={{
                width: "100%",
                borderRadius: "15px",
              }}
            />
          ) : (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e9f9ee",
                borderRadius: "15px",
                color: "#4d8f63",
              }}
            >
              Aucune image
            </div>
          )}
        </div>

        {/* RESULTAT */}
        <div
          style={{
            backgroundColor: "#f8fff9",
            padding: "20px",
            borderRadius: "20px",
            border: "2px solid #d7f5df",
          }}
        >
          <h2
            style={{
              color: "#1b8f3f",
              marginBottom: "20px",
            }}
          >
            Analyse 
          </h2>

          {prediction ? (
            <>
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "15px",
                  padding: "25px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <h3
                  style={{
                    fontSize: "32px",
                    color: "#2bbf59",
                    marginBottom: "10px",
                  }}
                >
                  {prediction}
                </h3>

                <p style={{ color: "#666" }}>
                  Déchet détecté
                </p>
              </div>

              <div
  style={{
    backgroundColor: "#e8fff0",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
  }}
>
  {Object.keys(infosBac).map((type) => {
    if (prediction.includes(type)) {
      return (
        <div key={type}>
          <img
            src={infosBac[type].image}
            alt={type}
            style={{
              width: "220px",
              marginBottom: "20px",
              borderRadius: "15px",
            }}
          />

          <h3
            style={{
              color: "#1d6d36",
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            {infosBac[type].nom}
          </h3>

          <p
            style={{
              color: "#555",
              fontSize: "18px",
            }}
          >
            {infosBac[type].conseil}
          </p>
        </div>
      )
    }

    return null
  })}
</div>
            </>
          ) : (
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e9f9ee",
                borderRadius: "15px",
                color: "#4d8f63",
              }}
            >
              En attente d'une analyse...
            </div>
          )}
        </div>
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

export default App