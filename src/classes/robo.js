import { Celula } from "./celula.js"
import { Custo } from "../enums/custos.js"
import { Direcao } from "../enums/direcao.js"
import { EstadoCelula } from "../enums/estado-celula.js"
import { SituacaoBusca } from "../enums/situacao-busca.js"
import { SituacaoCelula } from "../enums/situacao-celula.js"

export class Robo {
  qtdPassos = 0
  custoTotal = -1000
  locaisParaVisitar = new Array()
  trajeto = new Array()

  STEP_GIRO = 45
  DELAY_MOVIMENTO = 200
  DELAY_ROTACAO = 100

  comecarHtml = document.querySelector("#comecar")

  constructor(posL, posC, direcao, limiteDePassos, mapa, elementoRaiz) {
    this.posL = posL
    this.posC = posC
    this.direcao = direcao
    this.limiteDePassos = limiteDePassos
    this.mapa = mapa
    this.roboRef = elementoRaiz.querySelector("#robo")

    const [largura, altura] = mapa.getTamanhoCelula()
    this.roboRef.style.width = `${Math.max(5, largura - 10)}px`
    this.roboRef.style.height = `${Math.max(5, altura - 10)}px`
  }

  getQtdPassos() {
    return this.qtdPassos
  }

  posicionarElementoRobo() {
    const [roboTop, roboLeft] = this.mapa.getPosicaoElementoCelulaRobo()
    this.roboRef.style.top = `${roboTop + 5}px`
    this.roboRef.style.left = `${roboLeft + 5}px`
  }

  async buscaEmProfundidade() {
    this.comecarHtml.setAttribute("disabled", "true")
    this.roboRef.style.display = "block"

    this.locaisParaVisitar.push(new Celula(this.posL, this.posC))

    while (
      this.locaisParaVisitar.length > 0 &&
      this.qtdPassos < this.limiteDePassos
    ) {
      let celula = this.locaisParaVisitar.pop()

      let metaEncontrada = this.mapa.verificarMetaEncontrada(celula)
      await this.movimentar(celula, metaEncontrada)
      this.qtdPassos++

      this.trajeto.push([this.posL, this.posC])

      if (metaEncontrada) {
        this.comecarHtml.removeAttribute("disabled")

        return SituacaoBusca.MetaEncontrada
      }

      const vizinhos = this.mapa.consultaVizinhos(celula)
      for (let i = 0; i < vizinhos.length; i++) {
        const vizinho = vizinhos[i]
        const localExplorado = this.verificaSeJaFoiExplorado(
          vizinho.linha,
          vizinho.coluna
        )
        const localParaVisitar = this.verificaSeJaEstaNaLista(
          vizinho.linha,
          vizinho.coluna
        )

        if (localExplorado || localParaVisitar) {
          vizinhos.splice(i, 1)
          i--
        }
      }

      if (vizinhos.length === 0) {
        let celulaTemporaria = celula.raiz

        while (celulaTemporaria !== null) {
          await this.movimentar(celulaTemporaria)
          this.qtdPassos++

          if (celulaTemporaria.situacao !== SituacaoCelula.Fechado) {
            break
          }

          celulaTemporaria = celulaTemporaria.raiz
        }
      } else {
        for (const vizinho of vizinhos) {
          this.locaisParaVisitar.push(vizinho)
          celula.atribuirRamo(vizinho)
        }
      }
    }

    this.comecarHtml.removeAttribute("disabled")

    return this.qtdPassos >= this.limiteDePassos
      ? SituacaoBusca.LimiteDePassosExcedido
      : SituacaoBusca.MetaNaoEncontrada
  }

  async buscaEstrela() {
    this.comecarHtml.setAttribute("disabled", "true")
    this.roboRef.style.display = "block"

    const inicio = new Celula(this.posL, this.posC)
    const fim = this.mapa.getMeta()

    const caminho = this.buscarCaminhoAStar(inicio, fim)
    if (caminho) {
      for (let i = 1; i < caminho.length; i++) {
        const celula = caminho[i]
        const metaEncontrada = this.mapa.verificarMetaEncontrada(celula)

        await this.movimentar(celula, metaEncontrada)
        this.qtdPassos++

        this.trajeto.push([this.posL, this.posC])

        if (metaEncontrada) {
          this.comecarHtml.removeAttribute("disabled")

          return SituacaoBusca.MetaEncontrada
        }
      }
    }
    this.comecarHtml.removeAttribute("disabled")
    return SituacaoBusca.MetaNaoEncontrada
  }

  obterCelulaMenorCusto(celulas) {
    return celulas.reduce((celulaMenor, celula) =>
      celula.custoF < celulaMenor.custoF ? celula : celulaMenor
    )
  }

  construirCaminho(celula) {
    const caminho = []
    let celulaAtual = celula

    while (celulaAtual !== null) {
      caminho.unshift(celulaAtual)
      celulaAtual = celulaAtual.raiz
    }

    return caminho
  }

  buscarCaminhoAStar(inicio, fim) {
    const abertos = []
    const fechados = []

    abertos.push(inicio)

    while (abertos.length > 0) {
      const nodoAtual = this.obterCelulaMenorCusto(abertos)

      if (nodoAtual === fim) {
        return this.construirCaminho(nodoAtual)
      }

      abertos.splice(abertos.indexOf(nodoAtual), 1)
      fechados.push(nodoAtual)

      const vizinhos = this.mapa.consultaVizinhosEstrela(nodoAtual)
      for (const vizinho of vizinhos) {
        if (fechados.includes(vizinho)) {
          continue
        }

        const custoG = nodoAtual.custoG + 1
        const custoH = this.calcularDistanciaManhattan(vizinho, fim)
        const custoF = custoG + custoH

        if (!abertos.includes(vizinho) || custoF < vizinho.custoF) {
          vizinho.raiz = nodoAtual
          vizinho.custoG = custoG
          vizinho.custoH = custoH
          vizinho.custoF = custoF

          if (!abertos.includes(vizinho)) {
            abertos.push(vizinho)
          }
        }
      }
    }

    return null
  }

  calcularDistanciaManhattan(celula1, celula2) {
    const dx = Math.abs(celula1.linha - celula2.linha)
    const dy = Math.abs(celula1.coluna - celula2.coluna)
    return dx + dy
  }

  verificaSeJaFoiExplorado(linha, coluna) {
    return this.trajeto.some(c => {
      return c[0] === linha && c[1] === coluna
    })
  }

  verificaSeJaEstaNaLista(linha, coluna) {
    return this.locaisParaVisitar.some(c => {
      return c.linha === linha && c.coluna === coluna
    })
  }

  async movimentar(celula, metaEncontrada = false) {
    await this.girarParaNovaCelula(celula)
    this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Vazia)
    this.posL = celula.linha
    this.posC = celula.coluna

    if (metaEncontrada) {
      this.mapa.setCelula(this.posL, this.posC, EstadoCelula.MetaEncontrada)
    } else {
      this.mapa.setCelula(this.posL, this.posC, EstadoCelula.Robo)
    }

    celula.receberVisita()

    this.posicionarElementoRobo()

    const custoTotalHtml = document.getElementById("custo")

    custoTotalHtml.innerHTML = this.custoTotal.toString()

    await new Promise(resolve => setTimeout(resolve, this.DELAY_MOVIMENTO))
  }

  // Função que gira o robô para a posicao de uma nova celula considerando diagonal
  girarParaNovaCelula(celula) {
    // Calcula a diferença entre a posição atual e a nova posição
    const diferencaL = celula.linha - this.posL
    const diferencaC = celula.coluna - this.posC
    const direcaoAtual = this.direcao

    const direcaoPrev = this.direcao

    if (diferencaL === 0) {
      if (diferencaC > 0) {
        this.direcao = Direcao.Direita
      } else {
        this.direcao = Direcao.Esquerda
      }
    } else if (diferencaL > 0) {
      if (diferencaC === 0) {
        this.direcao = Direcao.Baixo
      } else if (diferencaC > 0) {
        this.direcao = Direcao.DireitaBaixo
      } else {
        this.direcao = Direcao.EsquerdaBaixo
      }
    } else {
      if (diferencaC === 0) {
        this.direcao = Direcao.Cima
      } else if (diferencaC > 0) {
        this.direcao = Direcao.DireitaCima
      } else {
        this.direcao = Direcao.EsquerdaCima
      }
    }

    const qtdGiros = Math.abs(direcaoAtual - this.direcao) / this.STEP_GIRO

    if (direcaoPrev !== this.direcao) {
      this.custoTotal += Custo.FicarParado + Custo.Girar * qtdGiros
    }

    this.roboRef.style.transform = `rotate(${this.direcao}deg)`

    return new Promise(resolve => setTimeout(resolve, this.DELAY_ROTACAO))
  }
}
