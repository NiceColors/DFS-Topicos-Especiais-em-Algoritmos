export let EstadoCelula

;(function(EstadoCelula) {
  EstadoCelula["Vazia"] = "."
  EstadoCelula["Obstaculo"] = "o"
  EstadoCelula["Meta"] = "x"
  EstadoCelula["Robo"] = "@"
  EstadoCelula["MetaEncontrada"] = "!"
})(EstadoCelula || (EstadoCelula = {}))
