const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = "d6A78Ae0529fc260995f9f1836f8f9b3"; // Ta clé
const SHEET_URL = "https://sheetdb.io/api/v1/TON_ID_SHEETDB"; // Ton lien SheetDB

app.use(express.json());

// 1. Route pour ACHETER un numéro
app.get('/commander', async (req, res) => {
    try {
        // On demande un numéro à l'API (Exemple pour WhatsApp)
        const response = await axios.get(`https://api.nom-du-service.com/stubs/handler_api.php?api_key=${API_KEY}&action=getNumber&service=wa&country=0`);
        
        // On enregistre dans Google Sheets
        await axios.post(SHEET_URL, { data: { numero: response.data.number, statut: "En attente" } });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).send("Erreur lors de la commande");
    }
});

// 2. Route pour VÉRIFIER le SMS
app.get('/verifier/:id', async (req, res) => {
    const { id } = req.params;
    const response = await axios.get(`https://api.nom-du-service.com/stubs/handler_api.php?api_key=${API_KEY}&action=getStatus&id=${id}`);
    res.json({ status: response.data });
});

app.listen(3000, () => console.log("Serveur prêt sur le port 3000"));
