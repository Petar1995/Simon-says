function main()
{
    const light = document.getElementById("light");
    const switchBtn = document.getElementById("switch");
    const startBtn = document.getElementById("startBtn");
    const strictBtn = document.getElementById("strictBtn");
    const strictLbl = document.getElementById("strictLbl");
    const levelLbl = document.getElementById("levelLbl");
    const redBtn = document.getElementById("redBtn");
    const yellowBtn = document.getElementById("yellowBtn");
    const greenBtn = document.getElementById("greenBtn");
    const blueBtn = document.getElementById("blueBtn");

    var timeout;
    var i=0;
    var game = {
         gameOn : false, //da li je igrica ukljucena (switch)
         currentLevel: 0,
         strictMode : false,
         clicked : null, //zadnje kliknuto dugme
         levels : [],
         ready : true, //da li igrac moze da klika
         started : false, //igra je u toku
    }
    const notes = {
        greenBtn: new Audio('src/audio/green.mp3'),
        redBtn: new Audio('src/audio/red.mp3'),
        blueBtn: new Audio('src/audio/blue.mp3'),
        yellowBtn: new Audio('src/audio/yellow.mp3'),
        wrong : new Audio('src/audio/wrong.mp3'),
    }
    const resetGame = function()
    {
        game.currentLevel=0;
        game.clicked=null;
        game.levels = [];
        game.ready= true;
        game.started= false;
    }
    const error = function()
    {
        i=0; 
        setTimeout(() => {
            notes.wrong.play();
        }, 200);
        if(game.strictMode)
        {
            clearTimeout(timeout);
            setTimeout(() => {
                resetGame();
                startGame();
            }, 500);
        }
        else
        {
            clearTimeout(timeout);
            game.ready=false;
            setTimeout(() => {
                simonPlayTones();
            }, 1500);
            
        }
    }

    //funkcija se poziva u eventListener na dugmad u boji
    const buttonClicked = function(temp)
    {
        game.clicked = temp;
        if(checkClick(temp))
        {
            i++;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                error();
            }, 10000);
            if(i>=game.levels.length)
            {
                if(i>=20)
                {
                    clearTimeout(timeout);
                    resetGame();
                    strictLbl.innerHTML = "Winner";
                    levelLbl.innerHTML = "";
                    i=0;
                    return;
                }
                game.ready=false;
                game.levels.push(getNote());
                game.currentLevel++;
                levelLbl.innerHTML = game.currentLevel;
                i=0;
                simonPlayTones();
            }
        }
        else
        {
            error();
        }
    }

    //proverava da li je dugme koje je kliknuto tacno za igru
    var checkClick = function()
    {
        if(game.clicked == game.levels[i]) return true;
        else return false;
    }


    const playTone = function(tone)
    {
        if(tone===0) 
        {
            notes.greenBtn.play();
            greenBtn.style.opacity = "1";
            setTimeout(() => {
                greenBtn.style.opacity = "0.7";
            }, 300);
        }
        else if(tone===1)
        {
            notes.redBtn.play();
            redBtn.style.opacity = "1";
            setTimeout(() => {
                redBtn.style.opacity = "0.7";
            }, 300);
        } 
        else if(tone===2)
        {
            notes.blueBtn.play();
            blueBtn.style.opacity = "1";
            setTimeout(() => {
                blueBtn.style.opacity = "0.7";
            }, 300);
        } 
        else if(tone===3)
        {
            notes.yellowBtn.play();
            yellowBtn.style.opacity = "1";
            setTimeout(() => {
                yellowBtn.style.opacity = "0.7";
            }, 300);
        } 
    }
    var getNote = function()
    {
        var temp = Math.floor(Math.random() * 4);
        return temp;
    }

    //blokira igraca da ista klikne i pokazuje dugmad redBtnom
    const simonPlayTones = function()
    {
        clearTimeout(timeout);
        game.ready=false;
        setTimeout(() => {
            playTone(game.levels[i]);
            i++;
            if(i<game.levels.length)
            {
                simonPlayTones();
            }
            else
            {
                game.ready = true;
                i=0;
                timeout = setTimeout(() => {
                    error();
                }, 10000);
            }
        }, 1000);
    }

    const startGame = function ()
    {
        if(game.started)
        {
            return;
        }
        else
        {
            var note = getNote();
            setTimeout(() => {
                playTone(note);
            }, 500);
            game.currentLevel = 1;
            levelLbl.innerHTML = game.currentLevel;
            game.levels.push(note);
            game.started = true;
            timeout = setTimeout(() => {
                error();
            }, 10000);
        }
    }
    const toggleHover = function()
    {
        redBtn.classList.toggle("hover");
        greenBtn.classList.toggle("hover");
        yellowBtn.classList.toggle("hover");
        blueBtn.classList.toggle("hover");
    }

    // switch - pali ili gasi igricu
    const toggleOnOff = function()
    {
        if(game.gameOn)
        {
            game.gameOn = false;
            game.strictMode = false;
            clearTimeout(timeout);
            strictLbl.innerHTML = "";
            switchBtn.style.marginLeft = "0";
            light.style.backgroundColor = "rgb(85, 0, 0)";
            levelLbl.innerHTML = " ";
            toggleHover();
        }
        else
        {
            resetGame();
            game.gameOn = true;
            switchBtn.style.marginLeft = "50%";
            light.style.backgroundColor = "greenBtn";
            levelLbl.innerHTML = "-";
            toggleHover();
        }
    }


    switchBtn.addEventListener("click", function()
    {
        toggleOnOff();
    });
    startBtn.addEventListener("click", function()
    {
        if(!game.gameOn) return;
        resetGame();
        startGame();
    });

    redBtn.addEventListener("click", function()
    {
        if(!game.gameOn || !game.ready) return;
        playTone(1);
        buttonClicked(1);
    });
    yellowBtn.addEventListener("click", function()
    {
        if(!game.gameOn  || !game.ready) return;
        playTone(3);
        buttonClicked(3);
    });
    greenBtn.addEventListener("click", function()
    {
        if(!game.gameOn  || !game.ready) return;
        playTone(0);
        buttonClicked(0);
    });
    blueBtn.addEventListener("click", function()
    {
        if(!game.gameOn  || !game.ready) return;
        playTone(2);
        buttonClicked(2);
    });
    strictBtn.addEventListener("click", function()
    {
        if(!game.gameOn || !game.ready) return;
        game.strictMode = !game.strictMode;
        if(game.strictMode)
        {
            strictLbl.innerHTML = "STRICT";
        }
        if(!game.strictMode)
        {
            strictLbl.innerHTML = "";
        }
    })
}

main();