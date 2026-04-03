const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "2136296",
  key: "a7544f5eacb1f30eb5d7",
  secret: "5ba7aa43048ceab09cf3",
  cluster: "us2",
  useTLS: true
});

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    const { target, mensaje } = req.body;
    
    try {
        await pusher.trigger(target, "nuevo-mensaje", {
          texto: mensaje
        });
        
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error al enviar a Pusher:", error);
        res.status(500).json({ error: "Error interno conectando con Pusher", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};