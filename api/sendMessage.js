const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
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
        res.status(500).json({ error: "Error interno conectando con Pusher" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};