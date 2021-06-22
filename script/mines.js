var hexlist = [];

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
function clearMines(){
    // console.log("clear");
    // TODO : delete field
    document.getElementById("field").innerHTML='';
    hexlist = [];
    createField();
}
function createField(){
    // console.log("create");
    var heightForm = document.getElementById('iHeight').value;
    // console.log("height = "+heightForm);
    var widthForm = document.getElementById('iWidth').value;
    // console.log(widthForm);
    var minesForm = document.getElementById('iMines').value;
    // console.log(minesForm);
    
    var fieldtag = document.getElementById("field");
    var idx=0;
    for(var y=heightForm; y>=-heightForm; y--){
        // console.log("y = "+y);
        fieldtag.innerHTML+='<div class="fieldRow"></div>'
        for(var x=0; x<(widthForm-Math.abs(y)); x++){
            // console.log("y = "+y+" x = "+x);
            // create hex html
            // create hex object and add to list
            idx=hexlist.length+1;
            hexlist.push(new Hex(x+Math.max(0,y*1),y*1+heightForm*1,idx));
            fieldtag.children[fieldtag.children.length-1].innerHTML+='<span class="hex" onclick="window.click('+idx+')"><span class="text" id='+idx+'>&nbsp;</span></span> ';
            // fieldtag.children[fieldtag.children.length-1].innerHTML+='<span class="hex" onclick="click()"><span class="text" id='+idx+'>1</span></span> ';
        }
        // document.getElementById("field").innerHTML+='</div>'
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
    
    var numMines = minesForm;
    var randomNum = 0;
    var numObjects = hexlist.length;

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }


createField();

// function click(pointer){
//     cHex=hexlist[pointer-1];
//     console.log("checking "+cHex.xloc+", "+cHex.yloc);
// }
function click(pointer){
    cHex=hexlist[pointer-1];
    // console.log("checking "+cHex.index+", "+cHex.xloc+", "+cHex.yloc);
    // document.getElementById(pointer).innerText=hexlist[pointer-1].adjacent.length;
    
    if(!cHex.visited){
        // console.log(cHex.isMine);
        cHex.visited=true;
        if(cHex.isMine){
            // console.log(cHex.adjacent);
            mineClicked();
            // console.log("clickeda mine");
        } else {
            minesAdjacent=0;
            cHex.adjacent.forEach(element => {
                if(element.isMine){
                    minesAdjacent++;
                    // console.log("mine "+element.isMine+" at "+element.xloc+", "+element.yloc);
                }
            });
            document.getElementById(pointer).innerText=minesAdjacent;
            // console.log("there were "+minesAdjacent+" mines adjacent");
            if(minesAdjacent==0){
                cHex.adjacent.forEach(element => {
                    click(element.index);
                });
            }
        }
    }
}

function mineClicked(){
    hexlist.forEach(element => {
        if(element.isMine){
            document.getElementById((element.index)).innerText='m';
        }
    });
}

