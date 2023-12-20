export let Direcao

;(function(Direcao) {
  Direcao[(Direcao["Cima"] = 0)] = "Cima"
  Direcao[(Direcao["DireitaCima"] = 45)] = "DireitaCima"
  Direcao[(Direcao["Direita"] = 90)] = "Direita"
  Direcao[(Direcao["DireitaBaixo"] = 135)] = "DireitaBaixo"
  Direcao[(Direcao["Baixo"] = 180)] = "Baixo"
  Direcao[(Direcao["EsquerdaBaixo"] = 225)] = "EsquerdaBaixo"
  Direcao[(Direcao["Esquerda"] = 270)] = "Esquerda"
  Direcao[(Direcao["EsquerdaCima"] = 315)] = "EsquerdaCima"
})(Direcao || (Direcao = {}))
