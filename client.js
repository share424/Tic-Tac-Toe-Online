var ws;
var shitPos = [ // 0 = nothing
    [0, 0, 0], //1 = circle
    [0, 0, 0], //2 = cross
    [0, 0, 0]
]
var playerShit = 'x';
var myTurn = true;
function setup(){
    init(); //init websocket

    createCanvas(400, 400);
    frameRate(30);

    if(confirm('is you x?')){
        playerShit = 'x';
    } else {
        playerShit = 'o';
        myTurn = false;
    }
}

function coordToShitPos(x, y){
    if(x < width/3){
        if(y < height/3){
            return [0, 0];
        } else if(y < height*2/3) {
            return [0, 1];
        } else if(y < height){
            return [0, 2];
        }
    } else if(x < width*2/3){
        if(y < height/3){
            return [1, 0];
        } else if(y < height*2/3) {
            return [1, 1];
        } else if(y < height){
            return [1, 2];
        }
    } else if(x < width){
        if(y < height/3){
            return [2, 0];
        } else if(y < height*2/3) {
            return [2, 1];
        } else if(y < height){
            return [2, 2];
        }
    }
    return null;
}

function shitPosToCoord(x, y){
    let w = width/3;
    let h = height/3;
    return [x*w + w/2, y*h + h/2]
}

function draw(){
    background(0);
    stroke(255);
    line(width/3, 0, width/3, height);
    line(width*2/3, 0, width*2/3, height);
    line(0, height/3, width, height/3);
    line(0, height*2/3, width, height*2/3);
    for(let i = 0; i<3; i++){
        for(let j = 0; j<3; j++){
            if(shitPos[j][i] == 1){
                let pos = shitPosToCoord(i, j);
                if(pos == null){
                    continue;
                }
                stroke(0, 0, 255);
                noFill();
                circle(pos[0], pos[1], width/6-10);
            } else if(shitPos[j][i] == 2){
                let pos = shitPosToCoord(i, j);
                if(pos == null){
                    continue;
                }
                let w = width/3 - 10;
                let h = height/3 - 10;
                stroke(255, 0, 0);
                line(pos[0] - w/2, pos[1] - h/2, pos[0] + w/2, pos[1] + h/2);
                line(pos[0] + w/2, pos[1] - h/2, pos[0] - w/2, pos[1] + h/2);
                
            }
        }
    }
    checkWin();
}

function checkWin(){
    if(playerShit == 'o'){
        if(shitPos[0][0] == 1 && shitPos[0][1] == 1 && shitPos[0][2] == 1){
            alert('you win');
        } else if(shitPos[1][0] == 1 && shitPos[1][1] == 1 && shitPos[1][2] == 1){
            alert('you win');
        } else if(shitPos[2][0] == 1 && shitPos[2][1] == 1 && shitPos[2][2] == 1){
            alert('you win');
        } else if(shitPos[0][0] == 1 && shitPos[1][0] == 1 && shitPos[2][0] == 1){
            alert('you win');
        } else if(shitPos[0][1] == 1 && shitPos[1][1] == 1 && shitPos[2][1] == 1){
            alert('you win');
        } else if(shitPos[0][2] == 1 && shitPos[1][2] == 1 && shitPos[2][2] == 1){
            alert('you win');
        } else if(shitPos[0][0] == 1 && shitPos[1][1] == 1 && shitPos[2][2] == 1){
            alert('you win');
        } else if(shitPos[2][0] == 1 && shitPos[1][1] == 1 && shitPos[0][2] == 1){
            alert('you win');
        }
    }
    if(playerShit == 'x'){
        if(shitPos[0][0] == 2 && shitPos[0][1] == 2 && shitPos[0][2] == 2){
            alert('you win');
        } else if(shitPos[1][0] == 2 && shitPos[1][1] == 2 && shitPos[1][2] == 2){
            alert('you win');
        } else if(shitPos[2][0] == 2 && shitPos[2][1] == 2 && shitPos[2][2] == 2){
            alert('you win');
        } else if(shitPos[0][0] == 2 && shitPos[1][0] == 2 && shitPos[2][0] == 2){
            alert('you win');
        } else if(shitPos[0][1] == 2 && shitPos[1][1] == 2 && shitPos[2][1] == 2){
            alert('you win');
        } else if(shitPos[0][2] == 2 && shitPos[1][2] == 2 && shitPos[2][2] == 2){
            alert('you win');
        } else if(shitPos[0][0] == 2 && shitPos[1][1] == 2 && shitPos[2][2] == 2){
            alert('you win');
        } else if(shitPos[2][0] == 2 && shitPos[1][1] == 2 && shitPos[0][2] == 2){
            alert('you win');
        }
    }
}

function mouseClicked(){
    var pos = coordToShitPos(mouseX, mouseY);
    if(pos == null){
        return false;
    }
    // if(playerShit == 'x'){
    //     shitPos[pos[1]][pos[0]] = 2;
    // } else { 
    //     shitPos[pos[1]][pos[0]] = 1;
    // }
    var move = {shit: playerShit, pos: pos};
    if(myTurn){
        ws.send(JSON.stringify(move));
    }
    
    
    return false;
}

function init() {

    // Connect to Web Socket
    ws = new WebSocket("ws://localhost:9001/");

    // Set event handlers.
    ws.onopen = function() {
        console.log("on open");
    };
      
    ws.onmessage = function(e) {
        // e.data contains received string.
        console.log("on message: " + e.data);
        var move = JSON.parse(e.data);
        if(shitPos[move.pos[1]][move.pos[0]] != 0){
            return;
        }
        if(move.shit == 'x'){
            shitPos[move.pos[1]][move.pos[0]] = 2;
        } else { 
            shitPos[move.pos[1]][move.pos[0]] = 1;
        }
        myTurn = !myTurn;
    };
      
    ws.onclose = function() {
        console.log("on close");
    };

    ws.onerror = function(e) {
        console.log(e)
    };

}
    
function onSubmit() {
    var input = document.getElementById("input");
    // You can send message to the Web Socket using ws.send.
    ws.send(input.value);
    output("send: " + input.value);
    input.value = "";
    input.focus();
}
    
function onCloseClick() {
    ws.close();
}
    