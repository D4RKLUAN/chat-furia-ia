Documentação do Projeto FURIA Fan Chat
📌 Visão Geral
Este projeto é um sistema completo de chat para fãs da FURIA Esports, com funcionalidades de cadastro, validação de documentos via OCR (Tesseract.js), integração com redes sociais e um chat em tempo real usando Socket.io. O sistema também inclui um assistente virtual especializado em informações sobre a FURIA, utilizando a API OpenRouter para respostas baseadas em IA.

🚀 Funcionalidades Principais
Sistema de Chat em Tempo Real

Chat com Socket.io

Envio de mensagens e imagens

Comandos especiais para interação com IA

Cadastro Completo de Usuário

Formulário multi-etapas

Validação de CPF, e-mail e outros campos

Busca automática de endereço via CEP

Validação de Documentos com IA

OCR com Tesseract.js

Comparação de dados do documento com formulário

Algoritmo de similaridade para nomes e CPF

Integração com Redes Sociais

Vinculação de contas (Twitter, Twitch, YouTube, etc.)

Armazenamento no localStorage

Assistente Virtual FURIA

Integração com OpenRouter API

Respostas contextualizadas sobre a FURIA

Fallback para respostas locais

🛠️ Estrutura do Projeto
furia-fan-chat/
│
├── public/                  # Arquivos estáticos
│   ├── complementares/      # Imagens e recursos
│   └── index.html           # Página inicial
│
├── server.js                # Servidor Node.js principal
├── script.js                # Lógica principal do front-end
│
├── cadastro.html            # Página de cadastro
├── chat.html                # Página do chat
├── teste.html               # Página de vinculação de redes
├── agradecimento.html       # Página de confirmação
├── index.html               # Página inicial
│
├── .env                     # Variáveis de ambiente (exemplo)
└── README.md                # Documentação
🔧 Configuração do Ambiente
Pré-requisitos
Node.js (v18+)

NPM ou Yarn

Conta no OpenRouter (opcional para respostas premium)

Passos para Instalação
Clone o repositório:

bash
git clone https://github.com/seu-usuario/furia-fan-chat.git
cd furia-fan-chat
Instale as dependências:

bash
npm install
Crie um arquivo .env na raiz do projeto:

env
PORT=3000
OPENROUTER_KEY=sua_chave_aqui
APP_URL=http://localhost:3000
Inicie o servidor:

bash
node server.js
Acesse no navegador:

http://localhost:3000
🌐 Fluxo do Usuário
Página Inicial (index.html)

Usuário insere nickname

Validação contra palavras ofensivas

Opção para cadastro completo

Cadastro (cadastro.html)

Formulário em 8 etapas

Validação de cada campo

Upload e validação de documento

Vinculação de Redes (teste.html)

Conexão com redes sociais

Armazenamento no localStorage

Chat (chat.html)

Chat em tempo real

Comando /furia para perguntas ao bot

Envio de imagens

Confirmação (agradecimento.html)

Mensagem final

Redirecionamento automático

🔌 Integrações
OpenRouter API
Fornece respostas de IA para perguntas sobre a FURIA

Configuração em server.js:

javascript
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const AI_MODELS = {
  FREE: "mistralai/mistral-7b-instruct",
  PAID: "openai/gpt-3.5-turbo"
};
ViaCEP
Busca automática de endereço por CEP

Implementação em script.js:

javascript
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

Tesseract.js
OCR para validação de documentos

Configuração em script.js:

javascript
Tesseract.workerOptions = {
  workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js',
  langPath: 'https://cdn.jsdelivr.net/npm/tesseract.js-data@4',
  corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4/tesseract-core.wasm.js'
};

🛡️ Segurança
Validação de Entrada

Filtro de palavras ofensivas em nicknames

Validação rigorosa de CPF e e-mail

Proteção de Dados

Dados sensíveis apenas no localStorage do cliente

Nenhum dado pessoal é armazenado no servidor

CORS Configurado

Restrito a origens específicas (em produção)

📈 Melhorias Futuras
Autenticação Segura

Implementar OAuth para redes sociais

Sistema de login com JWT

Banco de Dados

Armazenar perfis de usuários

Histórico de mensagens

Moderação

Filtro de mensagens ofensivas

Sistema de reporte

Features de Chat

Salas temáticas

Comandos moderadores

👨‍💻 Contribuição
Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b feature/AmazingFeature)

Commit suas mudanças (git commit -m 'Add some AmazingFeature')

Push para a branch (git push origin feature/AmazingFeature)

Abra um Pull Request

📄 Licença
Distribuído sob a licença MIT. Veja LICENSE para mais informações.

✉️ Contato
Equipe de Desenvolvimento - luanddlsln075@gmail.com
linkedin: https://www.linkedin.com/in/luandsr/
