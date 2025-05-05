# 🦊 FURIA Fan Chat

Sistema completo de chat para fãs da FURIA Esports com recursos de cadastro inteligente, validação de documentos via OCR, integração com redes sociais e interação em tempo real.

---

## 📌 Visão Geral

O **FURIA Fan Chat** é uma aplicação web interativa desenvolvida para engajar fãs da equipe FURIA Esports. O sistema oferece funcionalidades como:

- Chat em tempo real com envio de mensagens e imagens
- Validação de documentos com OCR (via Tesseract.js)
- Integração com redes sociais (Twitter, Twitch, YouTube, etc.)
- Formulário de cadastro multi-etapas
- Assistente virtual especializado com IA (OpenRouter API)

---

## 🚀 Funcionalidades Principais

### 💬 Sistema de Chat em Tempo Real
- Chat usando **Socket.io**
- Envio de mensagens e **imagens**
- Comando especial `/furia` para interação com IA

### 📝 Cadastro Completo de Usuário
- Formulário dividido em **8 etapas**
- Validação de **CPF**, e-mail e outros campos
- Busca de endereço automática via **CEP (ViaCEP)**

### 📄 Validação de Documentos com IA
- **OCR** com **Tesseract.js**
- Comparação de dados do documento com o formulário
- Algoritmo de similaridade para **nome e CPF**

### 🌐 Integração com Redes Sociais
- Vinculação de contas (Twitter, Twitch, YouTube, etc.)
- Armazenamento local com **localStorage**

### 🤖 Assistente Virtual FURIA
- Integração com a **API OpenRouter**
- Respostas baseadas em IA sobre a FURIA
- Fallback para respostas locais quando necessário

---

## 🛠️ Estrutura do Projeto

```
furia-fan-chat/
├── public/                  # Arquivos estáticos
│   └── complementares/     # Imagens e recursos
├── index.html              # Página inicial
├── cadastro.html           # Formulário multi-etapas
├── chat.html               # Interface de chat
├── teste.html              # Vinculação de redes sociais
├── agradecimento.html      # Tela de confirmação
├── script.js               # Lógica do front-end
├── server.js               # Backend com Node.js e Socket.io
├── .env                    # Variáveis de ambiente (exemplo)
└── README.md               # Documentação do projeto
```

---

## 🔧 Configuração do Ambiente

### ✅ Pré-requisitos

- Node.js (v18+)
- NPM ou Yarn
- Conta na [OpenRouter](https://openrouter.ai) (opcional para IA premium)

### 📥 Instalação

```bash
git clone https://github.com/seu-usuario/furia-fan-chat.git
cd furia-fan-chat
npm install
```

### 🔐 Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
OPENROUTER_KEY=sua_chave_aqui
APP_URL=http://localhost:3000
```

### ▶️ Inicialização

```bash
node server.js
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Fluxo do Usuário

1. **Página Inicial (`index.html`)**
   - Usuário insere nickname
   - Validação contra palavras ofensivas
   - Link para cadastro completo

2. **Cadastro (`cadastro.html`)**
   - Formulário em 8 etapas com validações
   - Upload de documento e OCR

3. **Vinculação de Redes (`teste.html`)**
   - Integração com redes sociais
   - Armazenamento local

4. **Chat (`chat.html`)**
   - Chat em tempo real
   - Comando `/furia` para perguntas ao bot
   - Envio de imagens

5. **Confirmação (`agradecimento.html`)**
   - Mensagem de boas-vindas
   - Redirecionamento automático

---

## 🔌 Integrações

### 🧠 OpenRouter API

```javascript
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const AI_MODELS = {
  FREE: "mistralai/mistral-7b-instruct",
  PAID: "openai/gpt-3.5-turbo"
};
```

### 🏠 ViaCEP

```javascript
function buscarEndereco(cep) {
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('endereco').value =
          `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      }
    });
}
```

### 🔎 Tesseract.js

```javascript
Tesseract.workerOptions = {
  workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js',
  langPath: 'https://cdn.jsdelivr.net/npm/tesseract.js-data@4',
  corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4/tesseract-core.wasm.js'
};
```

---

## 🛡️ Segurança

- Validação de entradas e filtro de palavras ofensivas
- Validação rigorosa de CPF e e-mail
- Dados sensíveis ficam apenas no **localStorage**
- Sem armazenamento de dados pessoais no servidor
- CORS configurado para ambientes seguros

---

## 📈 Melhorias Futuras

- 🔐 **Autenticação segura** com OAuth + JWT  
- 🗃️ **Banco de dados** para armazenar perfis e mensagens  
- 🚫 **Moderação** de mensagens ofensivas e sistema de denúncias  
- 💬 **Salas temáticas** e comandos para moderadores

---

## 👨‍💻 Contribuição

1. Fork o projeto  
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)  
3. Commit suas mudanças (`git commit -m 'Add NovaFuncionalidade'`)  
4. Push na branch (`git push origin feature/NovaFuncionalidade`)  
5. Abra um **Pull Request**

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

## ✉️ Contato

**Desenvolvedor:** Luanzin Gameplay  
📧 Email: luanddlsln075@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/luandsr/)