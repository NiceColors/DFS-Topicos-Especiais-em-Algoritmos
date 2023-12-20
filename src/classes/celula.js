import { EstadoCelula } from "../enums/estado-celula.js"
import { SituacaoCelula } from "../enums/situacao-celula.js"

export class Celula {
  ramos = []
  situacao = SituacaoCelula.AguardandoVisita
  estado = EstadoCelula.Vazia

  custoG = 0 // custo acumulado desde o inicio até a célula
  custoH = 0 // custo do nó até até a meta
  custoF = 0 // custo total

  constructor(linha, coluna, raiz = null) {
    this.linha = linha
    this.coluna = coluna
    this.raiz = raiz
  }

  recebeuVisita() {
    return (
      this.situacao === SituacaoCelula.Visitado ||
      this.situacao === SituacaoCelula.Fechado
    )
  }

  verificaSeDeveFechar() {
    return this.ramos.every(ramo => ramo.recebeuVisita())
  }

  receberVisita() {
    if (this.verificaSeDeveFechar()) {
      this.situacao = SituacaoCelula.Fechado
    } else {
      this.situacao = SituacaoCelula.Visitado
    }
  }

  atribuirRamo(ramo) {
    this.ramos.push(ramo)
  }
}
