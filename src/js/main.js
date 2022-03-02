
function main()
{

    const synthByUser = new Tone.Synth().toMaster();
    const synthBySimon = new Tone.Synth().toMaster();


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
    var tempTimeout;
    var count=0;
    var game = {
         gameOn : false, //da li je igrica ukljucena (switch)
         currentLevel: 0,
         strictMode : false,
         clicked : null, //zadnje kliknuto dugme
         levels : [],
         ready : false, //da li igrac moze da klika
         started : false, //igra je u toku
    }
    const notes = {
        greenBtn: "C4",
        redBtn: "D4",
        blueBtn: "E4",
        yellowBtn: "F4",
        wrong : "D1",
    }
    const resetGame = function()
    {
        game.currentLevel=0;
        game.clicked=null;
        game.levels = [];
        game.ready= false;
        game.started= false;
    }
    const error = function()
    {
        if(!game.gameOn) return;
        count=0; 
        synthBySimon.triggerAttackRelease(notes.wrong, "8n");
        levelLbl.innerHTML = "ERR";
        setTimeout(() => {
            levelLbl.innerHTML = game.currentLevel;
        }, 300);
        if(game.strictMode)
        {
            clearTimeout(timeout);
            resetGame();
            startGame();
        }
        else
        {
            clearTimeout(timeout);
            game.ready=false;
            simonPlayTones();
            
        }
    }

    //funkcija se poziva u eventListener na dugmad u boji
    const buttonClicked = function(temp)
    {
        game.clicked = temp;
        if(checkClick(temp))
        {
            count++;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                error();
            }, 10000);
            if(count>=game.levels.length)
            {
                if(count>=20)
                {
                    clearTimeout(timeout);
                    resetGame();
                    strictLbl.innerHTML = "Winner";
                    levelLbl.innerHTML = "";
                    count=0;
                    return;
                }
                game.ready=false;
                game.levels.push(getNote());
                game.currentLevel++;
                levelLbl.innerHTML = game.currentLevel;
                count=0;
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
        if(game.clicked == game.levels[count]) return true;
        else return false;
    }


    const playTone = function(tone)
    {
        if(tone===0) 
        {
            synthBySimon.triggerAttackRelease(notes.greenBtn, "8n");
            greenBtn.style.filter = "brightness(1)";
            setTimeout(() => {
                greenBtn.style.filter = "brightness(0.65)";
            }, 300);
        }
        else if(tone===1)
        {
            
            synthBySimon.triggerAttackRelease(notes.redBtn, "8n");
            redBtn.style.filter = "brightness(1)";
            setTimeout(() => {
                redBtn.style.filter = "brightness(0.65)";
            }, 300);
        } 
        else if(tone===2)
        {
            synthBySimon.triggerAttackRelease(notes.blueBtn, "8n");
            blueBtn.style.filter = "brightness(1)";
            setTimeout(() => {
                blueBtn.style.filter = "brightness(0.65)";
            }, 300);
        } 
        else if(tone===3)
        {
            synthBySimon.triggerAttackRelease(notes.yellowBtn, "8n");
            yellowBtn.style.filter = "brightness(1)";
            setTimeout(() => {
                yellowBtn.style.filter = "brightness(0.65)";
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
        tempTimeout = setTimeout(() => {
            playTone(game.levels[count]);
            count++;
            if(count<game.levels.length)
            {
                simonPlayTones();
            }
            else
            {
                game.ready = true;
                count=0;
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
            const note = getNote();
            game.currentLevel = 1;
            levelLbl.innerHTML = game.currentLevel;
            game.levels.push(note);
            simonPlayTones();
            game.started = true;
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
            resetGame();
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

    redBtn.addEventListener("mousedown", function()
    {
        if(!game.gameOn || !game.ready) return;
        synthByUser.triggerAttack(notes.redBtn);
        
    });
    redBtn.addEventListener("mouseup", function()
    {
        synthByUser.triggerRelease();
        if(!game.gameOn || !game.ready) return;
        buttonClicked(1);
    });
    redBtn.addEventListener("mouseleave", function()
    {
        synthByUser.triggerRelease();
    });



    yellowBtn.addEventListener("mousedown", function()
    {
        if(!game.gameOn  || !game.ready) return;
        synthByUser.triggerAttack(notes.yellowBtn);
        
    });
    yellowBtn.addEventListener("mouseup", function()
    {
        synthByUser.triggerRelease();
        if(!game.gameOn || !game.ready) return;
        buttonClicked(3);
    });
    yellowBtn.addEventListener("mouseleave", function()
    {
        synthByUser.triggerRelease();
    });

    greenBtn.addEventListener("mousedown", function()
    {
        if(!game.gameOn  || !game.ready) return;
        synthByUser.triggerAttack(notes.greenBtn);
        
    });
    greenBtn.addEventListener("mouseup", function()
    {
        synthByUser.triggerRelease();
        if(!game.gameOn || !game.ready) return;
        buttonClicked(0);
    });
    greenBtn.addEventListener("mouseleave", function()
    {
        synthByUser.triggerRelease();
    });

    blueBtn.addEventListener("mousedown", function()
    {
        if(!game.gameOn  || !game.ready) return;
        synthByUser.triggerAttack(notes.blueBtn);
        
    });
    blueBtn.addEventListener("mouseup", function()
    {
        synthByUser.triggerRelease();
        if(!game.gameOn || !game.ready) return;
        buttonClicked(2);
    });
    blueBtn.addEventListener("mouseleave", function()
    {
        synthByUser.triggerRelease();
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