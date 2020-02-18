//Basic Decelaretion
//here
let side1 = document.getElementById('Side1');
let sideC = document.getElementById('SideC');
let side2 = document.getElementById('Side2');
let displaytimerspan = document.getElementById('timing');
let boat,boatside='1',personOnBoat = 0,spannode,AlertBox,initialHeight,initialWidth;
let numberOfGames = 0,playingMinutes=00,playingSeconds=00,playingHours=00;
let timerStart = '',playerID=1,timer1,timer2,timer3,timer4,timer5,timer6,timer7,timer8,timer9;
/*
Name: updateLeaderBoard
Desc: Use to setup LeaderBoard
Input: null
Output: null
*/
function updateLeaderBoard(){
    let board = (document.getElementById('LeaderBoardTable')).lastElementChild;
    let newRow = document.createElement('tr');
    let name_ = document.createElement('td');
    let time_ = document.createElement('td');
    name_.appendChild(document.createTextNode(`User${playerID}`));
    time_.appendChild(document.createTextNode(`${playingMinutes}:${playingSeconds}`));
    newRow.appendChild(name_);
    newRow.appendChild(time_);
    board.appendChild(newRow);
    playerID+=1;
    document.getElementById(`userName`).innerHTML = `User${playerID}`;
    return null;
}
/*
Name: UpdateGameTimer
Desc: Use to setup time
Input: null
Output: null
*/
function UpdateGameTimer(){
    displaytimerspan.innerHTML = `${playingHours}:${playingMinutes}:${playingSeconds}`;

    playingSeconds+=1;//increment
    if(playingSeconds==60){//reseting
        playingSeconds = 0;
        playingMinutes+=1
        if(playingMinutes==60){
            playingMinutes=0;
            playingHours+=1;
        }
    }
}
/*
Name: startTheMatch
Desc: Use to setup various object used to play in game like persons, boats etc
Input: button Reference which is clicked
Output: null
*/
function startTheMatch(btn_){
    console.log(`startins function starts`);
    playingMinutes=0;
    playingSeconds=0;
    playingHours=0;
    numberOfGames += 1;
    boat='';
    boatside='1';
    personOnBoat = 0;
    spannode = '';
    AlertBox='';
    initialHeight='';
    initialWidth='';
    //enable reset btn
    document.getElementById(`resetBtn`).style.display = `inline-block`;
    //Starting timer
    try{ clearInterval(timerStart);//Clear timer if any
    } catch { console.log(); }
    UpdateGameTimer();
    timerStart = setInterval(() => {
        UpdateGameTimer();
    }, 1000);
    //removing current data from both sides...Present only first time 
    let alertbox = sideC.getElementsByTagName('div')[0];
        while(true){
            try{
                side1.removeChild(side1.lastElementChild);
            }catch{
                break;
            }
        }
        while(true){
            try{
                sideC.removeChild(sideC.lastElementChild);
            }catch{
                break;
            }
        }
        while(true){
            try{
                side2.removeChild(side2.lastElementChild);
            }catch{
                break;
            }
        }
        sideC.appendChild(alertbox);

    //Creating Objects
    for(let i=0;i<6;i++){
        let A;
        let person = document.createElement('div');
        person.addEventListener("click",function(){return GameON(this);});
        if(i<3){
            A = document.createTextNode('S');
            person.style.backgroundImage = "url('myfiles/images/hero.png')";
        } else {
            A = document.createTextNode('V'); 
            person.style.backgroundImage = "url('myfiles/images/villen.png')";
        }
        //For personAlert
        spannode = document.createElement('span');
        spannode.appendChild(document.createTextNode('Some Text for A'));
        person.className = 'person';
        person.appendChild(A);
        person.appendChild(spannode);
        side1.appendChild(person);
    }
    
    //Changing rules box to alert box
    AlertBox = sideC.getElementsByTagName('div')[0];
    AlertBox.style.top = '30%';
    AlertBox.innerHTML = '';
    //adding boat
    boat = document.createElement('div');//btn to transfer person
    boat.id='Boat_';
    boat.style.right = 'auto';
    boat.style.left = '0';
    console.log('boat posiiton: L/R> ',boat.style.left,boat.style.right);
    sideC.appendChild(boat);
    let swapbtn = document.createElement('button');//btn to transfer person
    let data = document.createTextNode('Click to Move');
    swapbtn.id="swapbutton";
    swapbtn.appendChild(data);
    swapbtn.style.top = '20%';
    swapbtn.addEventListener("click",function(){return MoveHere(this);});
    //adding to middel slide
    sideC.appendChild(swapbtn);
    if(arguments.length==1) btn_.remove();//remove start btn

    console.log('startins function Ends');
    return null;
}

/*
Name: resetTheGame
Desc: Check persons on both side and determine whether player won the game or loose
Input: None
Output: true
*/
function resetTheGame() {
    location.reload();
    let alertbox = sideC.getElementsByTagName('div')[0];
    while(true){
        try{
            side1.removeChild(side1.lastElementChild);
        }catch{
            break;
        }
    }
    while(true){
        try{
            sideC.removeChild(sideC.lastElementChild);
        }catch{
            break;
        }
    }
    while(true){
        try{
            side2.removeChild(side2.lastElementChild);
        }catch{
            break;
        }
    }
    sideC.appendChild(alertbox);
    
    for(let i=1;i<=9;i++){
        try{
            clearTimeout(`timer${i}`);
            console.log(`timer${i} disabled`);

        }
        catch{
            console.log(`timer${i} does not enabled`);
        }
    }
    startTheMatch();
    alert('New Match Start');
    return true;
}
/*
Name: checkgamewining
Desc: Check persons on both side and determine whether player won the game or loose
Input: None
Output: null
*/
function checkgamewining(){
    console.log('CheckWining Start>');
    let personOnSide2 = side2.childElementCount;
    let personOnSide1 = side1.childElementCount;
    if((personOnSide2 == '6')||(personOnSide1=='0')){
        alert(`You Won The Game\n Time Played: ${playingHours}:${playingMinutes}:${playingSeconds}`);
        updateLeaderBoard();
        resetTheGame();
        startTheMatch();
        return true;
    } else {
        function checkboth(side_of,person_length){
            let v = 0;//number of villans
            let s = 0;//number of saints
            let div_s = side_of.getElementsByTagName('div');
            for(let i=0;i<person_length;i++){
                if(div_s[i].innerHTML[0] == 'S') s+=1;
                else v+=1
            }
            if(s==0) s=4;
            if(person_length>=2) return v>s; //if more than 1 person is on side
            return false;
        }
    if(checkboth(side2,personOnSide2) || checkboth(side1,personOnSide1)){
        console.log('Lose');
        alert('You Loose the Game');
        return resetTheGame();//use to restart the game
    }
    }
    return false;
}
/*
Name: GameON
Desc: Transfer person form side to boat and vice-versa at boat side,
Input: Reference of person which is clicked
Output: null
*/
function GameON(person){
    //console.log('GameON function start');
    let parent = person.parentNode;//check parent of the person
    let dropside;    
    
    if(boatside==1) dropside = '1';//side 1 i.e., A
    else dropside = '2';//side 2 i.e. B

    if(parent.id[4] == dropside){
        if(personOnBoat==2){
        //Boat overflow
        person.lastChild.style.display = 'inline';
        person.lastChild.innerHTML = 'No Space On Boat';
        try{
            clearTimeout(timer1);
        } catch{ console.log()}
        timer1 = setTimeout(()=>{person.lastChild.style.display = 'none';},2000);
        AlertBox.innerHTML = 'Boat Is Full..!!';
        try{
            clearTimeout(timer2);
        } catch{ console.log()}
        timer2 = setTimeout(()=>{AlertBox.innerHTML = '';},2000);
        } else {
        personOnBoat+=1
        initialHeight = person.style.height;
        initialWidth = person.style.width;
        person.style.animationName ='personMovingUp';
        try{
            clearTimeout(timer3);
        } catch{ console.log()}
        timer3 = setTimeout(() => {
            person.style.height = '56px';
            person.style.width = '26px';
            person.style.animationName ='personMovingDown';            
            boat.appendChild(person);
        }, 300);
        
        //console.log(dropside,parent)        
        }
    } else {
        if(parent.id[4]=='_') {
            //Put person away from the boat
            if(dropside=='1'){  //donp on side 1
                person.style.animationName ='personMovingUp';
                try{
                    clearTimeout(timer4);
                } catch{ console.log()}
                let timer4 = setTimeout(() => {
                    person.style.animationName ='personMovingDown';            
                    side1.appendChild(person);
                    person.style.height = initialHeight;
                    person.style.width = initialWidth;          
                }, 300);
            }
            else{               //drop on side 2
                person.style.animationName ='personMovingUp';
                try{
                    clearTimeout(timer5);
                } catch{ console.log()}
                timer5 = setTimeout(() => {
                    person.style.animationName ='personMovingDown';            
                    side2.appendChild(person);
                    person.style.height = initialHeight;
                    person.style.width = initialWidth;           
                }, 300);
            }
            personOnBoat-=1;
        } else {        
            person.lastChild.style.display = 'inline';
            person.lastChild.innerHTML = 'Boat is on another side';
            try{
                clearTimeout(timer6);
            } catch{ console.log()}
            timer6 = setTimeout(()=>{person.lastChild.style.display = 'none';},3000);
            console.log('Might be on boat or boat at aother side');
        }
    }
    //console.log('GAMEON function Ends');
    return null;
}
/*
Name: MoveHere
Desc: Use to move boat from one side to another
Input: Reference of boat
Output: null
*/
function MoveHere(boatbtn){
    //console.log('MoveHere function start');
    if(boat.childElementCount>0){
    if(boatside==1){
        boat.style.animationName = 'boatMovingLeft';
        try{
            clearTimeout(timer7);
        } catch{ console.log()}
        timer7 = setTimeout(()=>{
        boat.style.left = 'auto';
        boat.style.right = '0px';
        //console.log('Left:auto,right:0 action performed');
        },500)
        boatside=0;
        console.log('To Side B');
    }
    else{
        boat.style.animationName = 'boatMovingRight';
        try{
            clearTimeout(timer8);
        } catch{ console.log()}
        timer8 = setTimeout(()=>{
            boat.style.left = '0';
            boat.style.right = 'auto';
        },500)
          boatside=1
        console.log('To Side A');
    }
    if(checkgamewining()){//we will check where gamer lose or win the game
        return true;//game over no further moveing of boat
    }
    }
    else{
        AlertBox.innerHTML = 'Boat Is Empty..!!';
        try{
            clearTimeout(timer9);
        } catch{ console.log()}
        timer9 = setTimeout(()=>{AlertBox.innerHTML = '';},2000);
        console.log('Empty Boat')
    }
    //console.log('MoveHere function Ends');
    return null;
}