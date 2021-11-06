
let placar = localStorage.getItem('placar');
const list = document.querySelector('.list');

console.log(list);

if(placar !== null) {
  placar = JSON.parse(placar);

  for(let i = 0; i < placar.length; i++) {
    const scoreList = document.createElement('li');
    scoreList.innerHTML = `${placar[i].name} - ${placar[i].result} pontos`;
    list.appendChild(scoreList);
  }
} 