
const canvas = document.querySelector('.canvas');
const telaDerResultados = document.querySelector('.pontos');
const botaoInicio = document.querySelector('.comecar');

let posicaoDoAtirador = 202; 
let altura = 15;
let direcao = 1;
let iniciado = false;


let posicaoAliens;
let aliensAcertados = [];


  
const aliens = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
]

let pontos = 0;




// --- funções externas

function comecar() {

  if(iniciado) {
   const resposta = window.confirm('você irá perder seu progresso, deseja continuar ?');
   
    if(resposta === true) {

      location.reload();

    }
    else {
      return;
    }

    
  } else {
    
    executar();
  }

}

function posionarAliens(parametro) {
  for(let i = 0; i < aliens.length; i ++) {

    if(!aliensAcertados.includes(i)) { 

      parametro[aliens[i]].classList.add('alien'); 

    }
   
  }
}

  
function remover(parametro) {
  for(let i = 0; i < aliens.length; i ++) {
    parametro[aliens[i]].classList.remove('alien'); 
  }
}
 
function salvar() {
  const nome = window.prompt("coloque um nome para seu save");

  if(nome === null) {
    return;
  }

  let placar = localStorage.getItem("placar");

  if(placar === null){
    placar = [];
  } else {
    placar = JSON.parse(placar);
  }

  placar.push({
    nome,
    resultado: pontos
  });

  localStorage.setItem("placar", JSON.stringify(placar));
}


// --------------------


// função de execução

function executar() {  

  iniciado = true;

  botaoInicio.innerHTML = 'REINICIAR JOGO'
  botaoInicio.classList.add('reiniciar')

  for(let i = 0; i < 225; i++) {
    const square = document.createElement('div');
    canvas.appendChild(square)
  }

  const aliensEmTela = Array.from(document.querySelectorAll('.canvas div'));
  
 
  posionarAliens(aliensEmTela);
  
  aliensEmTela[posicaoDoAtirador].classList.add('nave'); 

  function moverNave(e) {
    aliensEmTela[posicaoDoAtirador].classList.remove('nave'); 
  
    switch(e.key) { 
      case 'ArrowLeft':
        if(posicaoDoAtirador % altura !== 0) posicaoDoAtirador -=1
        break;
      case 'ArrowRight': 
        if(posicaoDoAtirador % altura < altura -1) posicaoDoAtirador +=1 
        break;
    }
  
    aliensEmTela[posicaoDoAtirador].classList.add('nave');
  
  }

  function tiro(e) { 
    let posicaoLaser;
    let posicaoDoLaser = posicaoDoAtirador; 
  
    function moveLaser() { 
  
      if (posicaoDoLaser < altura){ 
        aliensEmTela[posicaoDoLaser].classList.remove('laser')
        clearInterval(posicaoLaser)
        return
      }
  
      aliensEmTela[posicaoDoLaser].classList.remove('laser'); 
      posicaoDoLaser -= altura; 
      aliensEmTela[posicaoDoLaser].classList.add('laser');
  
      if(aliensEmTela[posicaoDoLaser].classList.contains('alien')) { 
  
        aliensEmTela[posicaoDoLaser].classList.remove('laser'); 
        aliensEmTela[posicaoDoLaser].classList.remove('alien'); 
        aliensEmTela[posicaoDoLaser].classList.add('explosao'); 
  
        setTimeout(() => aliensEmTela[posicaoDoLaser].classList.remove('explosao'), 300);
        clearInterval(posicaoLaser);
  
        const alienRemovido = aliens.indexOf(posicaoDoLaser); 
        aliensAcertados.push(alienRemovido); 
        pontos++;
        telaDerResultados.innerHTML = pontos; 
  
      }
      
  
    }
  
    switch(e.key) { 
      case 'ArrowUp':
        posicaoLaser = setInterval(moveLaser, 100) 
    }
  }


function moverAliens() {
  
  remover(aliensEmTela); 

  for(let i = 0; i < aliens.length; i++) {
    aliens[i] += direcao
  }

  posionarAliens(aliensEmTela); 

  if(aliensEmTela[posicaoDoAtirador].classList.contains('alien', 'nave')) { 

    telaDerResultados.innerHTML = 'GAME OVER'
    clearInterval(posicaoAliens); 

  }

  for(let i = 0; i < aliens.length; i ++) {
    if(aliens[i] > (aliensEmTela.length)) {
      telaDerResultados.innerHTML = 'GAME OVER'
      clearInterval(posicaoAliens)
    }
  }

  if(aliensAcertados.length === aliens.length) { 
    telaDerResultados.innerHTML = 'VOCÊ VENCEU!'
    clearInterval(posicaoAliens)
  }
}

  document.addEventListener('keydown', moverNave) 
  
  
  posicaoAliens = setInterval(moverAliens, 200)

  
  document.addEventListener('keydown', tiro) 
}