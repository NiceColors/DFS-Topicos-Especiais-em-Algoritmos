import { Celula } from "./celula.js"
import { EstadoCelula } from "../enums/estado-celula.js"

export class Mapa {
  matriz = []
  posicaoMeta = []

  constructor(qtdLinhas, qtdColunas, elementoRaiz) {
    this.qtdLinhas = qtdLinhas
    this.qtdColunas = qtdColunas
    this.mapaRef = elementoRaiz.querySelector("#matriz")
    this.criarMatriz()
  }

  getMeta() {
    const [linhaMeta, colunaMeta] = this.posicaoMeta
    return this.matriz[linhaMeta][colunaMeta]
  }

  criarMatriz() {
    this.mapaRef.innerHTML = ""

    for (let l = 0; l < this.qtdLinhas; l++) {
      this.matriz[l] = new Array()
      for (let c = 0; c < this.qtdColunas; c++) {
        const celula = new Celula(l, c)

        const divCelula = document.createElement("div")
        divCelula.classList.add("celula")
        divCelula.setAttribute("data-linha", l.toString())
        divCelula.setAttribute("data-coluna", c.toString())
        divCelula.setAttribute("data-type", celula.estado.toString())
        divCelula.setAttribute("title", `Linha: ${l} | Coluna: ${c}`)

        this.mapaRef.appendChild(divCelula)
        this.matriz[l][c] = celula
        this.mapaRef.style.gridTemplateColumns = `repeat(${this.qtdColunas}, 1fr)`
        this.mapaRef.style.gridTemplateRows = `repeat(${this.qtdLinhas}, 1fr)`
      }
    }
  }

  getTamanhoCelula() {
    const celula = this.mapaRef.querySelector(`.celula`)
    const detalhesElemento = celula.getBoundingClientRect()
    return [detalhesElemento.width, detalhesElemento.height]
  }

  getPosicaoElementoCelulaRobo() {
    let elementoCelula = this.mapaRef.querySelector(
      `.celula[data-type="${EstadoCelula.Robo}"]`
    )

    if (!elementoCelula) {
      elementoCelula = this.mapaRef.querySelector(
        `.celula[data-type="${EstadoCelula.MetaEncontrada}"]`
      )
    }

    const posicao = elementoCelula.getBoundingClientRect()
    return [posicao.top, posicao.left]
  }

  posicionarRobo(l, c) {
    this.setCelula(l, c, EstadoCelula.Robo)
  }

  posicionarMeta(l, c) {
    this.setCelula(l, c, EstadoCelula.Meta)
    this.posicaoMeta = [l, c]
  }

  posicionarObstaculos(percentual = 50) {
    const qtdCelulas = this.qtdLinhas * this.qtdColunas
    const qtdObstaculos = Math.floor((qtdCelulas * percentual) / 100)

    let qtdObstaculosInseridos = 0
    do {
      const linhaSugerida = Math.floor(Math.random() * this.qtdLinhas)
      const colunaSugerida = Math.floor(Math.random() * this.qtdColunas)

      const celula = this.matriz[linhaSugerida][colunaSugerida]

      if (celula.estado === EstadoCelula.Vazia) {
        this.setCelula(linhaSugerida, colunaSugerida, EstadoCelula.Obstaculo)
        qtdObstaculosInseridos++
      }
    } while (qtdObstaculos !== qtdObstaculosInseridos)
  }

  consultaVizinhosEstrela(celula) {
    const vizinhos = [] // Cria uma matriz vazia para armazenar as células vizinhas

    const linhas = [-1, 0, 1] // Define os possíveis deslocamentos nas linhas
    const colunas = [-1, 0, 1] // Define os possíveis deslocamentos nas colunas

    // Percorre todas as combinações possíveis de deslocamentos em linhas e colunas
    for (const linha of linhas) {
      for (const coluna of colunas) {
        // Verifica se a linha e a coluna estão ambas em zero. Se sim, ignora a própria célula
        if (linha === 0 && coluna === 0) {
          continue
        }

        const vizinhaLinha = celula.linha + linha // Calcula a linha da célula vizinha
        const vizinhaColuna = celula.coluna + coluna // Calcula a coluna da célula vizinha

        // Verifica se a célula vizinha está dentro dos limites da matriz e não é um obstáculo
        if (
          vizinhaLinha >= 0 &&
          vizinhaLinha < this.qtdLinhas &&
          vizinhaColuna >= 0 &&
          vizinhaColuna < this.qtdColunas &&
          this.matriz[vizinhaLinha][vizinhaColuna].estado !==
            EstadoCelula.Obstaculo
        ) {
          vizinhos.push(this.getCelula(vizinhaLinha, vizinhaColuna)) // Adiciona a célula vizinha à matriz de vizinhos
        }
      }
    }

    return vizinhos // Retorna a matriz de células vizinhas
  }

  consultaVizinhos(celula) {
    const vizinhos = new Array()

    // Cima esquerda
    if (
      celula.linha - 1 >= 0 &&
      celula.coluna - 1 >= 0 &&
      this.matriz[celula.linha - 1][celula.coluna - 1].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha - 1, celula.coluna - 1, celula))
    }

    // Esquerda
    if (
      celula.coluna - 1 >= 0 &&
      this.matriz[celula.linha][celula.coluna - 1].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha, celula.coluna - 1, celula))
    }

    // Baixo esquerda
    if (
      celula.linha + 1 < this.qtdLinhas &&
      celula.coluna - 1 >= 0 &&
      this.matriz[celula.linha + 1][celula.coluna - 1].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha + 1, celula.coluna - 1, celula))
    }

    // Baixo
    if (
      celula.linha + 1 < this.qtdLinhas &&
      this.matriz[celula.linha + 1][celula.coluna].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha + 1, celula.coluna, celula))
    }

    // Baixo direita
    if (
      celula.linha + 1 < this.qtdLinhas &&
      celula.coluna + 1 < this.qtdColunas &&
      this.matriz[celula.linha + 1][celula.coluna + 1].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha + 1, celula.coluna + 1, celula))
    }

    // Direita
    if (
      celula.coluna + 1 < this.qtdColunas &&
      this.matriz[celula.linha][celula.coluna + 1].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha, celula.coluna + 1, celula))
    }

    // Cima direita
    if (
      celula.linha - 1 >= 0 &&
      celula.coluna + 1 < this.qtdColunas &&
      this.matriz[celula.linha - 1][celula.coluna + 1].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha - 1, celula.coluna + 1, celula))
    }

    // Cima
    if (
      celula.linha - 1 >= 0 &&
      this.matriz[celula.linha - 1][celula.coluna].estado !==
        EstadoCelula.Obstaculo
    ) {
      vizinhos.push(new Celula(celula.linha - 1, celula.coluna, celula))
    }

    return vizinhos
  }

  getCelula(l, c) {
    return this.matriz[l][c]
  }

  setCelula(l, c, estado) {
    this.matriz[l][c].estado = estado
    this.mapaRef
      .querySelector(`.celula[data-linha="${l}"][data-coluna="${c}"]`)
      .setAttribute("data-type", estado)
  }

  verificarMetaEncontrada(celula) {
    return (
      this.posicaoMeta[0] === celula.linha &&
      this.posicaoMeta[1] === celula.coluna
    )
  }
}
