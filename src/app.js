import { Direcao } from "./enums/direcao.js";
import { Mapa } from "./classes/mapa.js"
import { Robo } from "./classes/robo.js"

export class App {
    LIMITE_DE_PASSOS = 200
    LINHAS = 15
    COLUNAS = 15

    POS_L_ROBO = Math.floor(Math.random() * this.LINHAS)
    POS_C_ROBO = Math.floor(Math.random() * this.COLUNAS)
    POS_L_META = Math.floor(Math.random() * this.LINHAS)
    POS_C_META = Math.floor(Math.random() * this.COLUNAS)

    constructor() {
        // Criação do mapa na página
        this.elementRef = document.querySelector("#app")
        this.mapa = new Mapa(this.LINHAS, this.COLUNAS, this.elementRef)
    }

    async run(algoritmoDeBusca) {
        this.mapa = new Mapa(this.LINHAS, this.COLUNAS, this.elementRef)

        const robo = new Robo(
            this.POS_L_ROBO,
            this.POS_C_ROBO,
            Direcao.Esquerda,
            this.LIMITE_DE_PASSOS,
            this.mapa,
            this.elementRef
        )

        this.mapa.posicionarRobo(this.POS_L_ROBO, this.POS_C_ROBO)

        // TODO: VALIDAR POSICAO DA META (DEVE SER DIFERENTE DA POSICAO DO ROBO)
        this.mapa.posicionarMeta(this.POS_L_META, this.POS_C_META)

        robo.posicionarElementoRobo()
        this.mapa.posicionarObstaculos()

        switch (algoritmoDeBusca) {
            case "Busca em Profundidade":
                this.imprimeResultado(await robo.buscaEmProfundidade(), robo)
                break

            case "Busca Estrela":
                this.imprimeResultado(await robo.buscaEstrela(), robo)
                break
        }
    }

    imprimeResultado(resultado, robo) {
        const modal = document.getElementById("modal")
        const modalContent = document.querySelector(".modal-content")

        const passosHtml = document.querySelector("#passos")

        passosHtml.innerHTML = robo.getQtdPassos().toString()

        modal.classList.add("show")
        modalContent.classList.add("show")
    }
}
