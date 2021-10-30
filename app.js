/*
  
  GAME SPACE INVADERS
  usando js puro sem libs

  baseado no vídeo: https://www.youtube.com/watch?v=3Nz4Yp7Y_uA

*/

// variáveis de elementos

const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');

// variáveis lógicas

let currentShooterIndex = 202; // posição do atirador no canvas
let width = 15;
let direction = 1;
let goingRight = true;


let invadersId;
let aliensRemoved = [];
let results = 0;

// Criação dos inimigos

for(let i = 0; i < 225; i++) {
  const square = document.createElement('div');
  grid.appendChild(square)
}

// Adicionando os quadrados a um array

const squares = Array.from(document.querySelectorAll('.grid div'));

// Desenhando invaders em tela a partir das posições iniciais

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

function draw() {
  for(let i = 0; i < alienInvaders.length; i ++) {

    if(!aliensRemoved.includes(i)) { // se o alien não tiver sido removido

      squares[alienInvaders[i]].classList.add('invader'); // transforma em um invasor com a classe (css)

    }
   
  }
}

draw(); // desenha inicialmente

squares[currentShooterIndex].classList.add('shooter'); // adicionando a class do personagem (nave)

// Removendo os aliens atingidos

function remove() {
  for(let i = 0; i < alienInvaders.length; i ++) {
    squares[alienInvaders[i]].classList.remove('invader'); //removendo a classe de invasor (css)
  }
}




// Criando movimentação do personagem

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove('shooter'); // removendo personagem para não repetir na tela

  switch(e.key) { // validando a tecla que foi pressionada
    case 'ArrowLeft':
      if(currentShooterIndex % width !== 0) currentShooterIndex -=1 // movendo a posição para esquerda
      break;
    case 'ArrowRight': 
      if(currentShooterIndex % width < width -1) currentShooterIndex +=1 // movendo a posição para direita
      break;
  }

  squares[currentShooterIndex].classList.add('shooter'); // adicionando a classe com a posição atual

}

document.addEventListener('keydown', moveShooter) // criando listener que vai ouvir as teclas


// Função de movimentação dos invasores

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0; // buscando a borda esquerda

  console.log(alienInvaders[alienInvaders.length - 1] % width);

  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1; // busca a borda direita com a distância 
  
  remove(); // limpar invaders

  if(rightEdge && goingRight) { // se estiver no lado direito e indo para direita
    for(let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1;
      direction = -1;
      goingRight = false;
    }
  }

  if(leftEdge && !goingRight) { // se estiver no lado esquerdo indo para esquerda
    for(let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width;
      direction = 1;
      goingRight = true;
    }
  }

  for(let i = 0; i < alienInvaders.length; i++) { // movendo os aliens
    alienInvaders[i] += direction
  }

  draw(); // desenhando aliens na tela

  if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) { // se chegar no index shooter e conter invader quer dizer que ouve a colisão

    resultsDisplay.innerHTML = 'GAME OVER'
    clearInterval(invadersId); // limpa o tempo de descida dos invaders
  }

  for(let i = 0; i < alienInvaders.length; i ++) {
    if(alienInvaders[i] > (squares.length)) {
      resultsDisplay.innerHTML = 'GAME OVER'
      clearInterval(invadersId)
    }
  }

  if(aliensRemoved.length === alienInvaders.length) { // valida se venceu
    resultsDisplay.innerHTML = 'YOU WIN'
    clearInterval(invadersId)
  }
}

invadersId = setInterval(moveInvaders, 500) // define tem de movimentação dos invadores

// Função de tiro

function shoot(e) { 
  let laserId;
  let currentLaserIndex = currentShooterIndex; // posição inicial do tiro

  function moveLaser() { // funçào de mover o laser

    if (currentLaserIndex < width){ // codigo que evita erros no console
      squares[currentLaserIndex].classList.remove('laser')
      clearInterval(laserId)
      return
    }

    squares[currentLaserIndex].classList.remove('laser'); // removendo tiro
    currentLaserIndex -= width; // definindo posição do tiro para cima
    squares[currentLaserIndex].classList.add('laser'); // adicionando classe do tiro

    if(squares[currentLaserIndex].classList.contains('invader')) { // validando se o tiro colidiu com o invasor

      squares[currentLaserIndex].classList.remove('laser'); // remove laser
      squares[currentLaserIndex].classList.remove('invader'); // remove invasor
      squares[currentLaserIndex].classList.add('boom'); // cria efeito de explosão

      setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300); // define o tempo da explosão
      clearInterval(laserId);

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex); // remove alien 
      aliensRemoved.push(alienRemoved); // altera estado
      results++; // soma placar
      resultsDisplay.innerHTML = results; // mostra novo placar


    }
    

  }

  switch(e.key) { // caso a seta mover pra cima seja pressionada
    case 'ArrowUp':
      laserId = setInterval(moveLaser, 100) // faz a movimentação do laser
  }
}

document.addEventListener('keydown', shoot) // listerner para ouvir botão de seta 