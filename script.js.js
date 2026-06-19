const residuos = [
    // ORGÂNICOS
    { nome: "Casca de Banana", arquivo: "casca_de_banana.jpg", categoria: "organico" },
    { nome: "Casca de Maçã", arquivo: "Casca de Maçã.jpg", categoria: "organico" },
    { nome: "Borra de Café", arquivo: "borra de café.jpg", categoria: "organico" },
    { nome: "Casca de Ovo", arquivo: "Casca de Ovo.jpg", categoria: "organico" },
    { nome: "Folhas Secas", arquivo: "folhas_secas.jpg", categoria: "organico" },
    { nome: "Resto de Almoço", arquivo: "resto_de_almoço.jpg", categoria: "organico" },
    { nome: "Frutas Estragadas", arquivo: "frutas_estragadasa.jpg", categoria: "organico" }, // Ajustado para o nome real com 'a' no final

    // RECICLÁVEIS
    { nome: "Garrafa PET", arquivo: "garrafa_pet.jpg", categoria: "reciclavel" },
    { nome: "Lata de Alumínio", arquivo: "lata_de_aluminio.jpg", categoria: "reciclavel" },
    { nome: "Papelão", arquivo: "papelão.jpg", categoria: "reciclavel" },
    { nome: "Jornal", arquivo: "jornal.jpg", categoria: "reciclavel" },
    { nome: "Revista", arquivo: "revista.jpg", categoria: "reciclavel" },
    { nome: "Pote de Vidro", arquivo: "pote_de_vidro.jpg", categoria: "reciclavel" },
    { nome: "Caixa de Leite", arquivo: "caixa_de_leite.jpg", categoria: "reciclavel" },
    { nome: "Lata de Refrigerante", arquivo: "Lata de Refrigerante.jpg", categoria: "reciclavel" },

    // REJEITOS
    { nome: "Fralda Descartável", arquivo: "fralda_descartável.jpg", categoria: "rejeito" },
    { nome: "Papel Higiênico", arquivo: "papel_higiênico.jpg", categoria: "rejeito" },
    { nome: "Bituca de Cigarro", arquivo: "bituca_de_cigarro.jpg", categoria: "rejeito" },
    { nome: "Máscara Descartável", arquivo: "mascara_descartavel.jpg", categoria: "rejeito" },
    { nome: "Esponja de Cozinha", arquivo: "esponja_de_cozinha.jpg", categoria: "rejeito" },
    { nome: "Cerâmica Quebrada", arquivo: "cerâmica_quebrada.jpg", categoria: "rejeito" }
];

let pontos = 0;
let nivel = 1;
let tempo = 60;
let acertos = 0;
let total = 0;

let jogoAtivo = false;
let timer;
let residuoAtual;
let nomeJogador = "";

let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
let recorde = localStorage.getItem("recorde") || 0;

document.getElementById("recorde").textContent = recorde;
const txtResiduo = document.getElementById("residuo");
const txtResultado = document.getElementById("resultado");
const imgResiduo = document.getElementById("imagemResiduo");

// Evita o erro inicial caso você não tenha a imagem padrao.jpg na pasta
imgResiduo.onerror = function () {
    imgResiduo.src = "https://picsum.photos/200/150?random=1"; 
};

atualizarRanking();

function novoResiduo() {
    const indice = Math.floor(Math.random() * residuos.length);
    residuoAtual = residuos[indice];
    txtResiduo.textContent = residuoAtual.nome;

    // Busca o nome do arquivo exatamente como ele está salvo na sua pasta mapeada acima
    let caminhoImagem = `imagens/${residuoAtual.arquivo}`;
    imgResiduo.src = caminhoImagem;

    imgResiduo.onerror = function () {
        console.warn(`Imagem não encontrada localmente: ${caminhoImagem}. Usando imagem temporária.`);
        imgResiduo.src = "https://picsum.photos/200/150?random=" + Math.random();
    };
}

function iniciarJogo() {
    nomeJogador = document.getElementById("nomeJogador").value;

    if (nomeJogador.trim() === "") {
        alert("Digite seu nome para jogar!");
        return;
    }

    pontos = 0;
    nivel = 1;
    tempo = 60;
    acertos = 0;
    total = 0;
    jogoAtivo = true;

    document.getElementById("pontos").textContent = pontos;
    document.getElementById("nivel").textContent = nivel;
    document.getElementById("tempo").textContent = tempo;
    txtResultado.innerHTML = "";

    novoResiduo();
    clearInterval(timer);

    timer = setInterval(() => {
        tempo--;
        document.getElementById("tempo").textContent = tempo;

        if (tempo <= 0) {
            finalizarJogo();
        }
    }, 1000);
}

function verificarResposta(resposta) {
    if (!jogoAtivo) return;

    total++;

    if (resposta === residuoAtual.categoria) {
        pontos += 10;
        acertos++;
        txtResultado.innerHTML = "✅ Correto!";
    } else {
        txtResultado.innerHTML = "❌ Incorreto!";
    }

    if (pontos >= 200) {
        nivel = 5;
    } else if (pontos >= 150) {
        nivel = 4;
    } else if (pontos >= 100) {
        nivel = 3;
    } else if (pontos >= 50) {
        nivel = 2;
    } else {
        nivel = 1;
    }

    document.getElementById("pontos").textContent = pontos;
    document.getElementById("nivel").textContent = nivel;

    novoResiduo();
}

function finalizarJogo() {
    jogoAtivo = false;
    clearInterval(timer);

    if (pontos > recorde) {
        recorde = pontos;
        localStorage.setItem("recorde", recorde);
        document.getElementById("recorde").textContent = recorde;
    }

    ranking.push({
        nome: nomeJogador,
        pontos: pontos
    });

    ranking.sort((a, b) => b.pontos - a.pontos);
    ranking = ranking.slice(0, 10);
    localStorage.setItem("ranking", JSON.stringify(ranking));

    atualizarRanking();

    const percentual = ((acertos / total) * 100 || 0).toFixed(1);
    let medalha = "";
    let desempenho = "";

    if (percentual >= 90) {
        medalha = "🥇";
        desempenho = "Excelente!";
    } else if (percentual >= 70) {
        medalha = "🥈";
        desempenho = "Muito Bom!";
    } else if (percentual >= 50) {
        medalha = "🥉";
        desempenho = "Bom!";
    } else {
        medalha = "📚";
        desempenho = "Continue treinando!";
    }

    txtResiduo.innerHTML = "🏁 Fim de Jogo";
    txtResultado.innerHTML = `
        <h2>${medalha} Resultado Final</h2>
        <p><strong>Jogador:</strong> ${nomeJogador}</p>
        <p><strong>Pontuação:</strong> ${pontos}</p>
        <p><strong>Acertos:</strong> ${acertos}/${total}</p>
        <p><strong>Aproveitamento:</strong> ${percentual}%</p>
        <h3>${desempenho}</h3>
    `;
}

function atualizarRanking() {
    const lista = document.getElementById("listaRanking");
    if (!lista) return;
    lista.innerHTML = "";

    ranking.forEach((jogador, indice) => {
        const item = document.createElement("li");
        item.textContent = `${indice + 1}º - ${jogador.nome} - ${jogador.pontos} pontos`;
        lista.appendChild(item);
    });
}

// Eventos vinculados aos IDs corretos do seu HTML
document.getElementById("startButton").addEventListener("click", iniciarJogo);

document.getElementById("brownButton").addEventListener("click", () => {
    verificarResposta("organico");
});

document.getElementById("greenButton").addEventListener("click", () => {
    verificarResposta("reciclavel");
});

document.getElementById("blueButton").addEventListener("click", () => {
    verificarResposta("rejeito");
});