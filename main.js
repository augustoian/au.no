// Elementos da DOM
const campoSenha = document.getElementById('campo-senha');
const btnCopiar = document.getElementById('btn-copiar');
const btnGerar = document.getElementById('btn-gerar');
const btnDiminuir = document.getElementById('btn-diminuir');
const btnAumentar = document.getElementById('btn-aumentar');
const tamanhoTexto = document.getElementById('tamanho-texto');

const chkMaiusculas = document.getElementById('chk-maiusculas');
const chkMinusculas = document.getElementById('chk-minusculas');
const chkNumeros = document.getElementById('chk-numeros');
const chkSimbolos = document.getElementById('chk-simbolos');

const forcaIndicador = document.getElementById('forca-indicador');
const forcaRotulo = document.getElementById('forca-rotulo');

// Conjuntos de Caracteres
const CHARS = {
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

let tamanhoSenha = 12;

// Alterar Tamanho da Senha
btnDiminuir.addEventListener('click', () => {
    if (tamanhoSenha > 4) {
        tamanhoSenha--;
        atualizarETamanhoseGera();
    }
});

btnAumentar.addEventListener('click', () => {
    if (tamanhoSenha < 32) {
        tamanhoSenha++;
        atualizarETamanhoseGera();
    }
});

function atualizarETamanhoseGera() {
    tamanhoTexto.textContent = tamanhoSenha;
    gerarSenha();
}

// Gerador de Senha
function gerarSenha() {
    let alfabeto = '';
    if (chkMaiusculas.checked) alfabeto += CHARS.maiusculas;
    if (chkMinusculas.checked) alfabeto += CHARS.minusculas;
    if (chkNumeros.checked) alfabeto += CHARS.numeros;
    if (chkSimbolos.checked) alfabeto += CHARS.simbolos;

    if (!alfabeto) {
        campoSenha.value = 'Selecione 1 opção';
        atualizarForca(0);
        return;
    }

    let senha = '';
    const arrayAleatorio = new Uint32Array(tamanhoSenha);
    window.crypto.getRandomValues(arrayAleatorio);

    for (let i = 0; i < tamanhoSenha; i++) {
        senha += alfabeto[arrayAleatorio[i] % alfabeto.length];
    }

    campoSenha.value = senha;
    calcularForca(senha);
}

// Cálculo de Força da Senha
function calcularForca(senha) {
    let pontos = 0;

    if (senha.length >= 8) pontos += 1;
    if (senha.length >= 12) pontos += 1;
    if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) pontos += 1;
    if (/[0-9]/.test(senha)) pontos += 1;
    if (/[^A-Za-z0-9]/.test(senha)) pontos += 1;

    atualizarForca(pontos);
}

function atualizarForca(pontos) {
    forcaIndicador.className = 'forca-indicador';

    if (pontos === 0) {
        forcaRotulo.textContent = '-';
    } else if (pontos <= 2) {
        forcaIndicador.classList.add('forca-fraca');
        forcaRotulo.textContent = 'Fraca';
    } else if (pontos <= 4) {
        forcaIndicador.classList.add('forca-media');
        forcaRotulo.textContent = 'Média';
    } else {
        forcaIndicador.classList.add('forca-forte');
        forcaRotulo.textContent = 'Forte';
    }
}

// Copiar para Área de Transferência
btnCopiar.addEventListener('click', () => {
    if (!campoSenha.value || campoSenha.value === 'Selecione 1 opção') return;

    navigator.clipboard.writeText(campoSenha.value).then(() => {
        const textoOriginal = btnCopiar.textContent;
        btnCopiar.textContent = 'Copiado!';
        setTimeout(() => btnCopiar.textContent = textoOriginal, 1500);
    });
});

// Evento para atualizar a força ao digitar manualmente
campoSenha.addEventListener('input', (e) => {
    const valor = e.target.value;
    calcularForca(valor);
    if (valor.length > 0) {
        tamanhoSenha = valor.length;
        tamanhoTexto.textContent = tamanhoSenha;
    }
});

// Listeners de Eventos
[chkMaiusculas, chkMinusculas, chkNumeros, chkSimbolos].forEach(chk => {
    chk.addEventListener('change', gerarSenha);
});

btnGerar.addEventListener('click', gerarSenha);

// Inicializar na carga
gerarSenha();
