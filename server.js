const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURATION
const API_KEY = "d6A78Ae0529fc260995f9f1836f8f9b3"; 
const SHEETDB_URL = "https://sheetdb.io/api/v1/tdlg4c82mooxt"; 

// 1. Route pour ACHETER un numéro
app.get('/commander', async (req, res) => {
    try {
        // On demande un numéro (Exemple ici configuré pour WhatsApp 'wa' en Russie '0' - à adapter selon ton fournisseur)
        // Note: L'URL ci-dessous est un exemple, utilise celle de la doc de ton fournisseur SMS
        const urlAchat = `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEY}&action=getNumber&service=wa&country=0`;
        
        const response = await axios.get(urlAchat);
        
        if (response.data.includes('ACCESS_NUMBER')) {
            const parties = response.data.split(':');
            const idCommande = parties[1];
            const numeroTel = parties[2];

            // Enregistrement dans ton Google Sheet
            await axios.post(SHEETDB_URL, {
                data: [{ "numero": numeroTel, "statut": "En attente" }]
            });
            
            res.json({ id: idCommande, number: numeroTel });
        } else {
            res.status(400).json({ error: "Plus de numéros disponibles ou solde insuffisant", detail: response.data });
        }
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// 2. Route pour VÉRIFIER le SMS
app.get('/verifier/:id', async (req, res) => {
    const { id } = req.params;
    const urlCheck = `https://api.sms-activate.org/stubs/handler_api.php?api_key=${API_KEY}&action=getStatus&id=${id}`;
    
    try {
        const response = await axios.get(urlCheck);
        res.json({ status: response.data });
    } catch (error) {
        res.status(500).json({ error: "Erreur de vérification" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
