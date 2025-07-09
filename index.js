import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Soporte para JSON y CORS
app.use(cors());
app.use(express.json());

// Lista de jugadores activos
const players = new Map(); // gamertag => { x, y, z, dimension, timestamp }

// Endpoint principal: los clientes mandan su posición
app.post("/update", (req, res) => {
    const { gamertag, position, dimension } = req.body;

    if (!gamertag || !position || !dimension) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // Guardar o actualizar la posición
    players.set(gamertag, {
        ...position,
        dimension,
        timestamp: Date.now()
    });

    // Buscar jugadores cercanos
    const nearby = [];
    for (const [tag, data] of players.entries()) {
        if (tag === gamertag || data.dimension !== dimension) continue;

        const dx = data.x - position.x;
        const dy = data.y - position.y;
        const dz = data.z - position.z;
        const distance = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

        if (distance <= 80) {
            let volume = 1 - distance / 80;
            volume = Math.max(volume, 0);
            nearby.push({ gamertag: tag, volume });
        }
    }

    res.json({ nearby });
});

// Limpiar jugadores que se fueron
setInterval(() => {
    const now = Date.now();
    for (const [tag, data] of players.entries()) {
        if (now - data.timestamp > 10000) { // 10 segundos sin actualizar
            players.delete(tag);
        }
    }
}, 5000);

app.listen(port, () => {
    console.log(`LVDS Voice Server activo en http://localhost:${port}`);
});
