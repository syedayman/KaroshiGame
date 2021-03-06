var score = document.querySelector(".score");
var playerScore = 50;
var userName = "anonymous";
var highest = 0;

//buttons
var login = document.getElementById("login");
var register = document.getElementById("register");
var playgame = document.getElementById("play");

//if user wants to play as guest
playgame.onclick = function(){
  if(document.getElementById("usernameGuest").value !==  ""){
      userName = document.getElementById("usernameGuest").value;
  }
  if(userName.length > 11){
    userName = userName.substring(0,11);
  }
  socket.emit('username-submit', userName);
  document.getElementById("play").style.visibility="hidden";
  document.getElementById("usernameGuest").style.visibility="hidden";
  document.getElementById("transparent-overlay").style.visibility="hidden";
}

//if user wants to login
login.onclick = function() {
  console.log(`logging in!`);
  if(document.getElementById("usernameLogin").value !==  ""){
    userName = document.getElementById("usernameLogin").value;
  }
  if(userName.length > 11){
    userName = userName.substring(0,11);
  }
    let password = document.getElementById("passwordLogin").value;
    socket.emit('login', {name: userName, pwd: password});
    document.getElementById("usernameLogin").style.visibility="hidden";
    document.getElementById("login").style.visibility="hidden";
    document.getElementById("passwordLogin").style.visibility="hidden";
    document.getElementById("transparent-overlay").style.visibility="hidden";
}

//if user wants to register
register.onclick = function() {
  console.log(`registering!`);
  if(document.getElementById("usernameReg").value !==  ""){
    userName = document.getElementById("usernameReg").value;
  }
  if(userName.length > 11){
    userName=userName.substring(0,11);
  }
    let password = document.getElementById("passwordReg").value;
    socket.emit('register', {name: userName, pwd: password});
    document.getElementById("usernameReg").style.visibility="hidden";
    document.getElementById("register").style.visibility="hidden";
    document.getElementById("passwordReg").style.visibility="hidden";
    document.getElementById("transparent-overlay").style.visibility="hidden";
}

// function disappear(){
//   //document.getElementById("transparent-overlay").style.visibility="hidden";
//   //document.getElementById("username").style.visibility="hidden";
// }
var Key = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
function listener(evt, element, fn) {
    if (window.addEventListener) 
        element.addEventListener(evt, fn, false);
    else
      element.attachEvent('on' + evt, fn);
}  

var direction = '';
function move(evt) {
  if (!evt)
    evt = window.event;
  var keycode = evt.keyCode || evt.which; 
  
  var info = document.getElementById("chat-form");
  var blob = document.getElementById("icon");
  switch (keycode) {
    case Key.LEFT:
      if((playerScore>0)){
        blob.style.left = parseInt(blob.style.left) - 5 + 'px';
        movePointer(keycode);
        direction = "Left";
        checkBoundary(blob,direction);
      }
      break;
    case Key.UP:
      if((playerScore>0)){
        blob.style.top = parseInt(blob.style.top) - 5 + 'px';
        movePointer(keycode);
        direction = "Up";
        checkBoundary(blob,direction);
      }
      break;
    case Key.RIGHT:
      if((playerScore>0)){
        blob.style.left = parseInt(blob.style.left) + 5 + 'px';
        movePointer(keycode);
        direction = "Right";
        checkBoundary(blob,direction);
      }
      break;
    case Key.DOWN:
      if((playerScore>0)){
        blob.style.top = parseInt(blob.style.top) + 5 + 'px';
        movePointer(keycode);
        direction = "Down";
        checkBoundary(blob,direction);
      }
      break;
    case 32: // space button
      switch (direction) {
        case "Left":
          if((playerScore>0)){
            playerShootLeft();
          }
          break;
        case "Right":
          if((playerScore>0)){
            playerShootRight();
          }
          break;
        case "Up":
          if((playerScore>0)){
            playerShootUp();
          }
          break;
        case "Down":
          if((playerScore>0)){
            playerShootDown();
          }
        break;
      }
      break;
    default:
    return;
  }
  for (let i = 0; i < pelletes.length; i++){
    if (cross(pelletes[i], blob)){
      var board = document.querySelector(".game-board");
      board.removeChild(pelletes[i]);
      playerScore= playerScore + 3;
      score.innerHTML = userName+" : "+playerScore;
      pelletes.splice(i, 1);
      pelletes.push(createpellet());
      }
  }
  for (let i = 0; i < masks.length; i++){
    if (cross(masks[i], blob)){
      var board = document.querySelector(".game-board");
      board.removeChild(masks[i]);
      playerScore = playerScore - 20;
      score.innerHTML = userName+" : "+playerScore;
      masks.splice(i, 1);
      masks.push(spawnmasks());
    }
  }
  for (let i = 0; i < sanitizers.length; i++){
    if (cross(sanitizers[i], blob)){
      var board = document.querySelector(".game-board");
      board.removeChild(sanitizers[i]);
      playerScore= playerScore - 25;
      score.innerHTML = userName+" : "+playerScore;
      sanitizers.splice(i, 1);
      sanitizers.push(spawnsan());
    }
  }
}

listener('keydown', document, move);

function highScore(){
  if(playerScore>highest){
    highest=playerScore
  }
}
setInterval(highScore,100);

function checkBoundary(element, direction){
  switch (direction) {
    case "Left":
      if(10 > parseInt(element.style.left)){
        element.style.left = parseInt(element.style.left) + 5 + 'px';
      }
    break;
    case "Right":
      if(950 < parseInt(element.style.left)){
        element.style.left = parseInt(element.style.left) - 5 + 'px';
      }
    break;
    case "Up":
      if(10 > parseInt(element.style.top)){
        element.style.top = parseInt(element.style.top) + 5 + 'px';
      }
    break;
    case "Down":
      if(600 < parseInt(element.style.top)){
        element.style.top = parseInt(element.style.top) - 5 + 'px';
      }
    break;
  }
}

  
function playerShootUp(){ // to shoot bullets upwards
  var element = document.getElementById("icon");
  var laser = document.getElementById("laser");
  laser.style.top = parseInt(element.style.top) + 50 + 'px';
  laser.style.left = parseInt(element.style.left) + 50 +'px';
  let start = Date.now();
  playerScore= playerScore - 5;
  score.innerHTML = userName+" : "+playerScore;
  let timer = setInterval(function() {
      let timePassed = Date.now() - start;
      laser.style.top = parseInt(laser.style.top) -8 +'px';
      shootSanitizer();
      shootMask();
      if (timePassed >= 4000)
        {clearInterval(timer); return;}
  }, 20);
}

function playerShootDown(){ // to shoot bullets downwards
  var element = document.getElementById("icon");
  var laser = document.getElementById("laser");
  laser.style.top = parseInt(element.style.top) + 50 + 'px';
  laser.style.left = parseInt(element.style.left) + 50 +'px';
  let start = Date.now();
  playerScore= playerScore - 5;
  score.innerHTML = userName+" : "+playerScore;
  let timer = setInterval(function() {
      let timePassed = Date.now() - start;
      laser.style.top = parseInt(laser.style.top) +8 +'px';
      shootSanitizer();
      shootMask();
      if (timePassed >= 4000)
        {clearInterval(timer); return;} 
  }, 20);
}

function playerShootRight(){// to shoot bullets to the right
  var element = document.getElementById("icon");
  document.getElementById("laser").style.transform = "rotate(90deg)";
  var laser = document.getElementById("laser");
  laser.style.top = parseInt(element.style.top) + 50 + 'px';
  laser.style.left = parseInt(element.style.left) + 50 +'px';
  let start = Date.now();
  playerScore= playerScore - 5;
  score.innerHTML = userName+" : "+playerScore;
  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    if (timePassed >= 4000)
      {clearInterval(timer); return;}
    laser.style.left = parseInt(laser.style.left) +8 +'px';
    shootSanitizer();
    shootMask();
  }, 20);}

  function playerShootLeft(){ // to shoot bullets to the left
    var element = document.getElementById("icon");
    document.getElementById("laser").style.transform = "rotate(90deg)";
    var laser = document.getElementById("laser");
    laser.style.top = parseInt(element.style.top) + 50 + 'px';
    laser.style.left = parseInt(element.style.left) + 50 +'px';
    let start = Date.now();
    playerScore= playerScore - 5;
    score.innerHTML = userName+" : "+playerScore;
    let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    if (timePassed >= 4000)
      {clearInterval(timer); return;}
    laser.style.left = parseInt(laser.style.left) -8 +'px';
    shootSanitizer();
    shootMask();
  }, 20);
}

function movePointer(keycode){
    var pointer = document.getElementById("arrow");
    var element = document.getElementById("icon");
    switch (keycode) {       
        //Left
        case 37:
            document.getElementById("arrow").style.transform = "rotate(135deg)";
            pointer.style.top = parseInt(element.style.top) + 50 + 'px';
            pointer.style.left = parseInt(element.style.left) + 50 +'px';
        break;
        //Right
        case 39:
            document.getElementById("arrow").style.transform = "rotate(-45deg)";
            pointer.style.top = parseInt(element.style.top) + 50 + 'px';
            pointer.style.left = parseInt(element.style.left) + 50 +'px';
        break;
        //Up
        case 38:
            document.getElementById("arrow").style.transform = "rotate(-135deg)";
            pointer.style.top = parseInt(element.style.top) + 50  + 'px';
            pointer.style.left = parseInt(element.style.left) + 50 +'px';
        break;
        //Down
        case 40:
            document.getElementById("arrow").style.transform = "rotate(45deg)";
            pointer.style.top = parseInt(element.style.top) + 50 + 'px';
            pointer.style.left = parseInt(element.style.left) + 50 +'px';
        break;
    }
};


function cross(element1, element2) {
  left1 = element1.offsetLeft; //i1x
  top1 = element1.offsetTop; //i1y
  right1 = element1.offsetLeft + element1.offsetWidth; //r1x
  bottom1 = element1.offsetTop + element1.offsetHeight; //r1y

  left2 = element2.offsetLeft; //i2x
  top2 = element2.offsetTop; //i2y
  right2 = element2.offsetLeft + element2.offsetWidth; //r2x
  bottom2 = element2.offsetTop + element2.offsetHeight; //r2y

  x_overlap = Math.max(0, Math.min(right1, right2) - Math.max(left1, left2));
  y_overlap = Math.max(0, Math.min(bottom1, bottom2) - Math.max(top1, top2));
  overlapArea = x_overlap * y_overlap;

  if (overlapArea == 0 || isNaN(overlapArea)) {
      return false;
  }
  return true;

}

function shootSanitizer (){
  for(let i = 0; i < sanitizers.length; i++){
    if(cross(sanitizers[i],laser)){
      var board = document.querySelector(".game-board");
      board.removeChild(sanitizers[i]);
      sanitizers.push(spawnsan());
    }
  }
}

function shootMask(){
  for (let i = 0; i < masks.length; i++){
    if (cross(masks[i], laser)){
      var board = document.querySelector(".game-board");
      board.removeChild(masks[i]);
      masks.push(spawnmasks());
    }
  }
}
pelletes = new Array();
for (var i = 0; i < 200; i++ ){
  pelletes.push(createpellet());
}

sanitizers = new Array();
for (var i = 0; i < 10; i++ ) {
    sanitizers.push(spawnsan());
}
masks = new Array();
for (var i = 0; i < 10; i++ ) {
    masks.push(spawnmasks());
}

