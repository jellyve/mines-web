var hexlist = [];
var inactive = false;

class Hex {
    isMine=false;
    visited=false;
    flagged=false;
    xloc;
    yloc;
    index;
    adjacent=[];
    constructor(xloc, yloc, iIndex) {
        this.xloc=xloc*1;
        this.yloc=yloc*1;
        this.index=iIndex*1;
    }
}

// called by new game button
function clearMines(){

    //  delete field
    document.getElementById("field").innerHTML='';
    hexlist = [];
    inactive = false;
    
    // set up the field again
    createField();
}

function createField(){

    // get the height, width, mines input
    var heightForm = document.getElementById('iHeight').value;
    var widthForm = document.getElementById('iWidth').value;
    var minesForm = document.getElementById('iMines').value;
    
    // get the hmtl tag of the field
    var fieldtag = document.getElementById("field");
    var idx=0;
    
    // add rows to field (based on height)
    for(var y=heightForm; y>=-heightForm; y--){
        fieldtag.innerHTML+='<div class="fieldRow"></div>'
        // add mines to field (based on width)
        for(var x=0; x<(widthForm-Math.abs(y)); x++){
            idx=hexlist.length+1;
            // create hex object and add to list
            hexlist.push(new Hex(x+Math.max(0,y*1),y*1+heightForm*1,idx));
            // create hex html
            fieldtag.children[fieldtag.children.length-1].innerHTML+=
            '<span class="hex" onclick="window.click('+idx+')" oncontextmenu="javascript:window.flag('+idx+');return false;"><span class="text" id='+idx+'>&nbsp;</span></span> ';
        }
    }

    // calculate adjacent, checks from top left to top right then down
    for(var i=0; i<hexlist.length;i++){
        for(var j=i+1; j<hexlist.length;j++){
            // same row
            if (hexlist[i].yloc==hexlist[j].yloc){
                if(hexlist[i].xloc-hexlist[j].xloc==-1){
                    hexlist[i].adjacent.push(hexlist[j]);
                    hexlist[j].adjacent.push(hexlist[i]);
                }
            // row below
            } else if(hexlist[i].yloc-hexlist[j].yloc==1){
                if(hexlist[i].xloc==hexlist[j].xloc){
                    hexlist[i].adjacent.push(hexlist[j]);
                    hexlist[j].adjacent.push(hexlist[i]);
                }
                if(hexlist[i].xloc-hexlist[j].xloc==1){
                    hexlist[i].adjacent.push(hexlist[j]);
                    hexlist[j].adjacent.push(hexlist[i]);
                }
            }
        }
    }
    
    // set a (randomly selected) subset of elements to be mines
    var numMines = minesForm;
    var randomNum = 0;
    var numObjects = hexlist.length;

    // loop through all hexes, making the probability that each one is a mine based on how many mines are left to place and how many hexes are left
    for (var i = 0; i < hexlist.length; i++)
    {
        randomNum = getRandomInt(0,numObjects)+1;
        if(randomNum<=numMines){
            hexlist[i].isMine=true;
            numMines--;
        } else {
            hexlist[i].isMine=false;
        }
        numObjects--;
    }
}

// helper function for randomly setting mines
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// call the field creation on page load
createField();

// what to do if a hex is clicked, call the flood fill (which then calls itself when you click on a zero)
function click(pointer){

    // if you haven't won or lost yet
    if(!inactive){

        floodfill(pointer);

        // check if you've won
        var win = true;

        hexlist.forEach(element => {
            if(!element.isMine && !element.visited){
                win = false;
            }
        });
        if(win){
            window.alert("You won!")
            inactive=true;
        }
    }
}

function flag(pointer){
    if(!inactive){
        // select the hex that was 'clicked'
        cHex=hexlist[pointer-1];
        if(!cHex.visited){
            cHex.flagged=true;
            document.getElementById(pointer).innerText="F";
            
            // check if you've won
            var win = true;
            
            hexlist.forEach(element => {
                if(element.isMine!=element.flagged){
                    win = false;
                }
            });
            if(win){
                window.alert("You won!")
                inactive=true;
            }
        }
    }
}

function floodfill(pointer){
    
    // select the hex that was 'clicked'
    cHex=hexlist[pointer-1];
    
    // don't do anything if it has already been revealed
    if(!cHex.visited){
        cHex.visited=true;
        cHex.flagged=false;

        // check if it's a mine
        if(cHex.isMine){

            // if it is, reveal all mines
            hexlist.forEach(element => {
                if(element.isMine){
                    document.getElementById((element.index)).innerText='m';
                }
            });

            inactive=true;

        } else {

            // if it's not a mine, how many mines are adjacent
            minesAdjacent=0;
            cHex.adjacent.forEach(element => {
                if(element.isMine){
                    minesAdjacent++;
                }
            });

            // change the tile
            document.getElementById(pointer).innerText=minesAdjacent;
            document.getElementById(pointer).classList.add("mines"+minesAdjacent);
            
            // if the tile was a zero, call a 'click' on all surrounding tiles
            if(minesAdjacent==0){
                cHex.adjacent.forEach(element => {
                    floodfill(element.index);
                });
            }
        }
    }
}

