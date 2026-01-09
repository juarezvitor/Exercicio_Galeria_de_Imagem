// Seleção de elementos do DOM
let InputBuscar = document.getElementById("InputBuscar");
let ButtonBuscar = document.getElementById("ButtonBuscar")
let Form = document.getElementById("Formdebusca");
let TituloPagina = document.getElementById("TituloPagina");
let fotosCarregadas = [];

// Carregar fotos iniciais ao carregar a página
async function CarregarFotosIniciais() {
    const fotos = await ReqUnsplashAPI("random");
    fotosCarregadas = fotos;
    ExibirFotos(fotosCarregadas);
}
// Evento para carregar fotos iniciais quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    CarregarFotosIniciais();
});




//função que pega o valor do input a cada digitação 
function ObterValorTmpReal() {
    InputBuscar.addEventListener("input", (e) => {
        const termo = e.target.value.toLowerCase();
        // Se o campo de busca estiver vazio, exibe todas as fotos carregadas
        if (termo === "") {
            ExibirFotos(fotosCarregadas);
            return;
        }

        // Filtra as fotos carregadas com base no termo de busca
        const fotosFiltradas = fotosCarregadas.filter(foto => {
            const nomeFoto = (foto.alt_description || "").toLowerCase();
            return nomeFoto.includes(termo);
        });

        ExibirFotos(fotosFiltradas);
    });
}


//função que pega o valor atual do input
function GetValorInput() {
    return InputBuscar.value;
}

// Botão de submit responsavel por enviar as palavras-chave para api
function BotaoEnviar(callback) {
    // Adiciona o evento de submit ao formulário
    Form.addEventListener("submit", (e) => {
        e.preventDefault();
        callback();
    });

}

// Classe para interagir com a API do Unsplash
async function ReqUnsplashAPI(query) {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&per_page=15&client_id=xtecVUeWHhMFyCBoOGsV6_g2MA33dZSvrip5UvYiapM`
        );
        if (!response.ok) {
            throw new Error("Erro na requisição");
        }
        const data = await response.json();
        console.log(data.results);
        return data.results;

    } catch (error) {
        console.error("Erro ao buscar imagens:", error);
    }
}

// Função para exibir as fotos na grade
function ExibirFotos(fotos) {
    const gridContainer = document.querySelector('.GridFotos');
    gridContainer.innerHTML = ''; // Limpa fotos anteriores
    // Verifica se há fotos para exibir caso não, exibe mensagem de nenhuma foto encontrada
    if (!fotos || fotos.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Nenhuma foto encontrada';
        mensagem.classList.add('MensagemVazia');

        gridContainer.appendChild(mensagem);
        return;
    }
    // Cria elementos para cada foto e adiciona à grade
    fotos.forEach(foto => {

        // Cria o container do card da foto
        const divCardFoto = document.createElement('div');
        divCardFoto.classList.add("CardFoto");

        // Cria o elemento de imagem
        const img = document.createElement('img');
        img.src = foto.urls.small;
        img.alt = foto.alt_description;
        img.classList.add("CardImagem")

        // Cria o elemento de parágrafo para o nome da foto
        const paragrafo = document.createElement('p');
        paragrafo.textContent = foto.alt_description || 'Sem descrição';
        paragrafo.classList.add("NomedaFoto");





        // Anexa os elementos criados ao container da grade
        gridContainer.appendChild(divCardFoto);
        divCardFoto.appendChild(img);
        divCardFoto.appendChild(paragrafo);

    });
}

// Inicializa os eventos
ObterValorTmpReal();

// Funçaõ de callback passada para o botão de submit responsavel por enviar as palavras-chave para api
BotaoEnviar(
    async () => {
        let query = GetValorInput().trim();


        let fotos = await ReqUnsplashAPI(query);

        fotosCarregadas = fotos; // 🔥 guarda todas
        ExibirFotos(fotosCarregadas);
    }
)


