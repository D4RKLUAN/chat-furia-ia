const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const axios = require('axios');

// Carregar variáveis do .env de forma explícita
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log("🔑 OPENROUTER_KEY carregada:", process.env.OPENROUTER_KEY);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


// Configuração OpenRouter (VERIFIQUE SEU .env!)
const OPENROUTER_API_KEY = process.env.OPENROUTER_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Modelos disponíveis (com fallback automático)
const AI_MODELS = {
  FREE: "mistralai/mistral-7b-instruct",
  PAID: "openai/gpt-3.5-turbo"
};

// Dados dos usuários
const users = new Map();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Função para criar headers CORRETAMENTE
function getOpenRouterHeaders() {
  const headers = {
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000", // Configure no .env!
    "X-Title": "FURIA Chat"
  };

  // Modo anônimo se não tiver chave
  headers["Authorization"] = OPENROUTER_API_KEY 
    ? `Bearer ${OPENROUTER_API_KEY}`
    : "Bearer anonymous";

  return headers;
}

// Socket.IO
io.on('connection', (socket) => {
  console.log('Novo usuário conectado');

  // Quando usuário entra no chat
  socket.on('join', (nickname) => {
    const userColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    users.set(socket.id, { nickname, color: userColor });
    
    socket.emit('welcome', `👋 Bem-vindo, ${nickname}! Digite /furia "sua mensagem aqui" para tirar sua duvidas com IAFuria.`);
    socket.broadcast.emit('message', {
      nickname: 'Sistema',
      text: `${nickname} entrou no chat!`,
      color: '#888'
    });
  });

  // Quando recebe mensagem
  socket.on('chatMessage', async (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    // Se for comando /furia
    if (data.text && data.text.startsWith('/furia ')) {
      const pergunta = data.text.slice(7).trim();
      
      try {
        const response = await axios.post(
          OPENROUTER_API_URL,
          {
            model: OPENROUTER_API_KEY ? AI_MODELS.PAID : AI_MODELS.FREE,
            messages: [
              {
                role: "system",
                content: "Você é um especialista fanático no time FURIA Esports de CS:GO. Responda em português com gírias brasileiras em até 2 linhas."
              },
              {
                role: "user",
                content: pergunta
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          },
          {
            headers: getOpenRouterHeaders(), // 👈 Usa headers corretos
            timeout: 5000 // Timeout de 5 segundos
          }
        );

        const resposta = response.data.choices[0].message.content;
        socket.emit('message', {
          nickname: 'FURIA Bot',
          text: resposta,
          color: '#FF5722'
        });
      } catch (err) {
        console.error('Erro OpenRouter:', err.response?.data || err.message);
        
        // Fallback para respostas locais
        const fallbackResponses = [
          "A FURIA tá em chamas! 🔥 Lineup: arT, KSCERATO, yuurih, FalleN e chelo!",
          "Último título: ESL Pro League S17 em 2023! 🏆",
          "Próximo jogo? Confira com /proximojogo",
          "FURIA Style: Jogada agressiva e muita raça! 💪"
        ];
        
        socket.emit('message', {
          nickname: 'FURIA Bot',
          text: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
          color: '#FF5722'
        });
      }
      return;
    }

    // Mensagem normal ou imagem
    io.emit('message', {
      nickname: user.nickname,
      text: data.text,
      image: data.image,
      color: user.color
    });
  });

  // Quando usuário desconecta
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      io.emit('message', {
        nickname: 'Sistema',
        text: `${user.nickname} saiu do chat.`,
        color: '#888'
      });
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Modo OpenRouter: ${OPENROUTER_API_KEY ? 'Premium' : 'Free'}`);
});