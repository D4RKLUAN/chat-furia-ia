let currentStep = 1;
const totalSteps = 8;

// ==============================================
// FUNÇÕES ORIGINAIS (MANTIDAS SEM ALTERAÇÕES)
// ==============================================

function nextStep(step) {
  if (!validateStep(step)) return;
  
  document.getElementById(`step-${step}`).classList.remove('active');
  document.getElementById(`progress-${step}`).classList.remove('active');
  
  currentStep = step + 1;
  
  document.getElementById(`step-${currentStep}`).classList.add('active');
  document.getElementById(`progress-${currentStep}`).classList.add('active');
}

function prevStep(step) {
  document.getElementById(`step-${step}`).classList.remove('active');
  document.getElementById(`progress-${step}`).classList.remove('active');
  
  currentStep = step - 1;
  
  document.getElementById(`step-${currentStep}`).classList.add('active');
  document.getElementById(`progress-${currentStep}`).classList.add('active');
}

function validateStep(step) {
  let isValid = true;
  
  switch(step) {
    case 1:
      const nome = document.getElementById('nome').value;
      if (nome.length < 3) {
        document.getElementById('error-nome').textContent = 'Nome deve ter pelo menos 3 caracteres';
        isValid = false;
      } else {
        document.getElementById('error-nome').textContent = '';
      }
      break;
      
    case 2:
      const cpf = document.getElementById('cpf').value;
      if (!validarCPF(cpf)) {
        document.getElementById('error-cpf').textContent = 'CPF inválido';
        isValid = false;
      } else {
        document.getElementById('error-cpf').textContent = '';
      }
      break;
      
    case 3:
      const email = document.getElementById('email').value;
      if (!validarEmail(email)) {
        document.getElementById('error-email').textContent = 'E-mail inválido';
        isValid = false;
      } else {
        document.getElementById('error-email').textContent = '';
      }
      break;
      
    case 4:
      const rede = document.getElementById('rede').value;
      if (rede.length < 2 || !rede.includes('@')) {
        document.getElementById('error-rede').textContent = 'Informe um @ válido';
        isValid = false;
      } else {
        document.getElementById('error-rede').textContent = '';
      }
      break;
      
    case 5:
      const cep = document.getElementById('cep').value;
      if (cep.length < 8) {
        document.getElementById('error-endereco').textContent = 'CEP inválido';
        isValid = false;
      } else {
        document.getElementById('error-endereco').textContent = '';
        buscarEndereco(cep);
      }
      break;
      
    case 6:
      const checkboxes = document.querySelectorAll('input[name="interesses"]:checked');
      if (checkboxes.length === 0) {
        document.getElementById('error-interesses').textContent = 'Selecione pelo menos um interesse';
        isValid = false;
      } else {
        document.getElementById('error-interesses').textContent = '';
      }
      break;
      
    case 7:
      const eventos = document.getElementById('eventos').value;
      if (eventos.length < 10) {
        document.getElementById('error-eventos').textContent = 'Descreva pelo menos um evento';
        isValid = false;
      } else {
        document.getElementById('error-eventos').textContent = '';
      }
      break;
  }
  
  return isValid;
}

function submitForm() {
  if (!validateStep(8)) return;
  
  const formData = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    email: document.getElementById('email').value,
    rede: document.getElementById('rede').value,
    endereco: {
      cep: document.getElementById('cep').value,
      endereco: document.getElementById('endereco').value,
      numero: document.getElementById('numero').value,
      complemento: document.getElementById('complemento').value
    },
    interesses: Array.from(document.querySelectorAll('input[name="interesses"]:checked')).map(el => el.value),
    eventos: document.getElementById('eventos').value,
    compras: document.getElementById('compras').value.split('\n').filter(item => item.trim() !== '')
  };
  
  document.getElementById('step-8').classList.remove('active');
  document.getElementById('confirmacao').classList.remove('hidden');
  
  const confirmacaoHTML = `
    <p><strong>Nome:</strong> ${formData.nome}</p>
    <p><strong>CPF:</strong> ${formData.cpf}</p>
    <p><strong>E-mail:</strong> ${formData.email}</p>
    <p><strong>Rede Social:</strong> ${formData.rede}</p>
    <p><strong>Endereço:</strong> ${formData.endereco.endereco}, ${formData.endereco.numero} ${formData.endereco.complemento}</p>
    <p><strong>Interesses:</strong> ${formData.interesses.join(', ')}</p>
    <p><strong>Eventos:</strong> ${formData.eventos}</p>
    <p><strong>Compras recentes:</strong> ${formData.compras.join(', ')}</p>
  `;
  
  document.getElementById('dados-confirmacao').innerHTML = confirmacaoHTML;
}

function enviarDados() {
  console.log('Dados enviados para o servidor');
  mostrarValidacaoDocumento();
}

Tesseract.workerOptions = {
  workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/worker.min.js',
  langPath: 'https://cdn.jsdelivr.net/npm/tesseract.js-data@4',
  corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4/tesseract-core.wasm.js'
};

function mostrarValidacaoDocumento() {
  document.getElementById('confirmacao').classList.add('hidden');
  document.getElementById('documento-verificacao').classList.remove('hidden');
  
  const dropArea = document.getElementById('drop-area');
  const fileInput = document.getElementById('doc-input');
  
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight() {
    dropArea.classList.add('highlight');
  }
  
  function unhighlight() {
    dropArea.classList.remove('highlight');
  }
  
  dropArea.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    fileInput.files = files;
    handleFiles(files);
  }
  
  fileInput.addEventListener('change', function() {
    handleFiles(this.files);
  });
}

function handleFiles(files) {
  const file = files[0];
  const previewContainer = document.getElementById('preview-container');
  const btnValidar = document.getElementById('btn-validar-ia');
  
  if (!file.type.match('image.*')) {
    alert('Por favor, envie uma imagem (JPEG, PNG) do seu documento!');
    return;
  }

  previewContainer.innerHTML = '';
  
  const img = document.createElement('img');
  img.src = URL.createObjectURL(file);
  img.onload = function() {
    URL.revokeObjectURL(img.src);
  };
  
  previewContainer.appendChild(img);
  btnValidar.disabled = false;
  
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  
  document.getElementById('dados-comparados').innerHTML = `
    <li><strong>Nome esperado:</strong> ${nome || 'Não informado'}</li>
    <li><strong>CPF esperado:</strong> ${cpf || 'Não informado'}</li>
    <li><strong>Status:</strong> Aguardando verificação...</li>
  `;
}

// ==============================================
// MELHORIAS NA VALIDAÇÃO DE DOCUMENTOS (ATUALIZADO)
// ==============================================

// Nova função auxiliar para cálculo de similaridade
function calcularSimilaridade(str1, str2) {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  return intersection.size / Math.max(set1.size, set2.size);
}

document.getElementById('btn-validar-ia').addEventListener('click', async function() {
  const fileInput = document.getElementById('doc-input');
  const iaStatus = document.getElementById('ia-status');
  const iaMessage = document.getElementById('ia-message');
  const btnValidar = document.getElementById('btn-validar-ia');
  const dadosComparados = document.getElementById('dados-comparados');
  
  if (!fileInput.files?.length) {
    alert('Por favor, selecione um documento primeiro!');
    return;
  }

  const nomeFormulario = document.getElementById('nome').value.trim();
  const cpfFormulario = document.getElementById('cpf').value.replace(/\D/g, '');

  if (!nomeFormulario || !cpfFormulario) {
    alert('Preencha todos os campos do formulário antes de validar');
    return;
  }

  btnValidar.disabled = true;
  iaStatus.classList.remove('hidden');
  iaMessage.textContent = "Analisando documento...";
  
  dadosComparados.innerHTML = `
    <li><strong>Nome esperado:</strong> ${nomeFormulario}</li>
    <li><strong>CPF esperado:</strong> ${cpfFormulario}</li>
    <li><strong>Status:</strong> Processando...</li>
  `;

  try {
    const { data: { text } } = await Tesseract.recognize(
      fileInput.files[0],
      'por+eng',
      {
        logger: progress => {
          iaMessage.textContent = `Processando... ${Math.round(progress.progress * 100)}%`;
        },
        tessedit_pageseg_mode: 6,
        preserve_interword_spaces: 1
      }
    );

    // Pré-processamento avançado (atualizado)
    const cleanText = text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-.,]/g, ' ')  // Mantém pontos e vírgulas
      .replace(/\s+/g, ' ');

    console.log('Texto extraído:', text);
    console.log('Texto limpo:', cleanText);

    // Validação de nome com múltiplas estratégias (atualizado)
    const nomeEncontrado = (() => {
      // Remove preposições e artigos
      const nomeLimpo = nomeFormulario
        .toLowerCase()
        .replace(/\b(de|do|da|dos|das|e)\b/g, '')
        .trim();
      
      // Busca por similaridade (aumentar threshold)
      const similaridade = calcularSimilaridade(cleanText, nomeLimpo);
      if (similaridade >= 0.85) return true;
      
      // Busca por partes do nome (pelo menos 2 partes correspondentes)
      const partesNome = nomeLimpo.split(/\s+/).filter(p => p.length > 2);
      const matches = partesNome.filter(part => cleanText.includes(part));
      return matches.length >= Math.max(2, partesNome.length - 1);
    })();

    // Validação de CPF (melhorada)
    const cpfEncontrado = [
      cpfFormulario,
      cpfFormulario.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
      cpfFormulario.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1 $2 $3 $4'),
      cpfFormulario.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1$2$3$4')
    ].some(variation => {
      // Remove possíveis espaços ou pontuações do texto extraído
      const cleanDocText = cleanText.replace(/[^0-9]/g, '');
      return cleanDocText.includes(variation.replace(/[^0-9]/g, ''));
    });

    // Exibição de resultados (melhorada)
    dadosComparados.innerHTML = `
      <li><strong>Nome no documento:</strong> ${nomeEncontrado ? '✅ Encontrado' : '❌ Não encontrado'}</li>
      <li><strong>CPF no documento:</strong> ${cpfEncontrado ? '✅ Encontrado' : '❌ Não encontrado'}</li>
      <li><strong>Status:</strong> ${nomeEncontrado && cpfEncontrado ? '✅ Validação concluída' : '❌ Falha na validação'}</li>
      <li><strong>Texto reconhecido:</strong> <small>${cleanText.substring(0, 100)}${cleanText.length > 100 ? '...' : ''}</small></li>
    `;

    if (nomeEncontrado && cpfEncontrado) {
      iaMessage.textContent = "✅ Documento validado com sucesso!";
      setTimeout(() => window.location.href = "teste.html", 2000);
    } else {
      iaMessage.textContent = nomeEncontrado 
        ? "❌ CPF não encontrado no documento" 
        : cpfEncontrado 
          ? "❌ Nome não encontrado no documento"
          : "❌ Nome e CPF não encontrados no documento";
      btnValidar.disabled = false;
    }

  } catch (error) {
    console.error('Erro na validação:', error);
    iaMessage.textContent = "❌ Erro ao processar documento";
    dadosComparados.innerHTML += `<li><strong>Erro:</strong> ${error.message}</li>`;
    btnValidar.disabled = false;
  }
});

// ==============================================
// FUNÇÕES AUXILIARES (MANTIDAS ORIGINAIS)
// ==============================================

function pularValidacao() {
  if (confirm('Deseja pular a validação do documento?')) {
    window.location.href = "teste.html";
  }
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g,'');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buscarEndereco(cep) {
  cep = cep.replace(/\D/g, '');
  
  if (cep.length !== 8) return;
  
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('endereco').value = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      } else {
        document.getElementById('error-endereco').textContent = 'CEP não encontrado';
      }
    })
    .catch(() => {
      document.getElementById('error-endereco').textContent = 'Erro ao buscar CEP';
    });
}

document.getElementById('cep').addEventListener('blur', function() {
  buscarEndereco(this.value);
});