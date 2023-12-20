import { App } from "./app.js";

const comecar = document.querySelector('#comecar');
const algoritmoDeBusca = document.querySelector('#algoritmo-de-busca')

comecar.addEventListener('click', () => {
    
    const app = new App();
    app.run(algoritmoDeBusca.value);
    
});


algoritmoDeBusca.addEventListener('change', () => {
    const custoHtml = document.querySelector('#custo');
    const passosHtml = document.querySelector('#passos');

    custoHtml.innerHTML = '';
    passosHtml.innerHTML = '';
});

