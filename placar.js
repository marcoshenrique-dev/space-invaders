
let placar = localStorage.getItem('placar');
const lista = document.querySelector('.lista');


if(placar !== null) {
  placar = JSON.parse(placar);

  for(let i = 0; i < placar.length; i++) {
    const scoreList = document.createElement('li');
    scoreList.innerHTML = `${placar[i].nome} - ${placar[i].resultado} pontos`;
    lista.appendChild(scoreList);
  }
} 