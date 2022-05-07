//var unit = "%";
var unit = "px";
var w300 = 180;
var n = 3;
var tileSize = 60;
var board = [,];
var tileZero; //Pos
var mixing = false;

document.getElementById('getval').addEventListener('change', readURL2, true);
 
function initBoard(e){

    n = parseInt(e.innerHTML.substring(0, 1));
    board = [];
    var panel = document.getElementById("panel");
    panel.innerHTML = "";
    var w = window.innerWidth;
    //w300 = 90 * w / 100
    if (w > 650)
        w300 = 600;
    else if (w > 500)
        w300 = 480;
    else if (w > 380)
        w300 = 360;
    else if (w > 300)
        w300 = 300;
    else
        w300 = 180;

    w300 = 180;
    //w300 = 600;
    panel.style.width = w300 + unit;
    panel.style.height = w300 + unit;
    tileSize = w300 / n;

    var tiles = "";

    for (var i = 0; i < n; i++) {
        board[i] = [];
        for (var j = 0; j < n; j++) {
            var value = (i * n + j + 1) % (n * n);

            board[i][j] = value;
            //tiles += newTile(i, j, value);
            var obj = newTile(i, j, value);
            panel.appendChild(obj);
        }
    }
    //panel.innerHTML = tiles;
    tileZero = new Pos(n - 1, n - 1 );

}

function onClick(e) {
    var y = LocationToPosition(e);
    var x = Tile(y);
    console.log(x.innerHTML + " -- " + x.style.left + "-->" + x.style.top);

    var posClicked = LocationToPosition(e);
    var sg = 0;
    var start = 0;
    var end = 0;
    var horiz = true;
    if (posClicked.row == tileZero.row && posClicked.col == tileZero.col) {
        //
    }
    else if (posClicked.row == tileZero.row) {
        sg = tileZero.col < posClicked.col ? 1 : -1;
        start = tileZero.col;
        end = posClicked.col;
    }
    else if (posClicked.col == tileZero.col) {
        horiz = false;
        sg = tileZero.row < posClicked.row ? 1 : -1;
        start = tileZero.row;
        end = posClicked.row;
    }


    for (var i = start; sg * i < sg * end; i += sg) {
        var p1 = new Pos(i + sg, i + sg);
        if (horiz)
            p1.row = tileZero.row;
        else
            p1.col = tileZero.col;
        MoveToZero(p1);
    }

    if (!mixing && BoardOK())
        alert("Congratulaions!!! \n\nYou win");
}

function BoardOK() {
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            if (board[i][j] != n * i + j + 1 && board[i][j] != 0)
                return false;
        }
    }
    return true;
}

function MoveToZero(pos) {

    var p0 = Tile(tileZero);
    var p = Tile(pos);

    //var a1 = p.style.left;
    //var b1 = p0.style.left;
    var a1 = parseInt(p.style.left.replace(unit, ""));
    var b1 = parseInt(p0.style.left.replace(unit, ""));
    var dir = true;
    if (a1 == b1) {
        //a1 = p.style.top;
        //b1 = p0.style.top;
        a1 = parseInt(p.style.top.replace(unit, ""));
        b1 = parseInt(p0.style.top.replace(unit, ""));
        dir = false;
    }
    var sg1 = a1 < b1 ? 1 : -1;
    var f = w300 / Math.abs(a1 - b1);
    //p0.Visible = false;
    for (var i = a1; i * sg1 <= b1 * sg1; i += sg1) {

        //var pn = new Point(p.Location.X, p.Location.Y);
        var pnx = parseInt(p.style.left.replace(unit, ""));
        var pny = parseInt(p.style.top.replace(unit, ""));


        if (dir)
            pnx = i;
        else
            pny = i;

        //p.Location = pn;
        p.style.left = pnx + unit;
        p.style.top = pny + unit;

        if (!mixing) {
            setTimeout(() => { console.log("prit"); }, 500);
            //Thread.Sleep(f);
        }
    }
    //p0.Visible = true;


    //p0.Location = new Point(tileSize * pos.col, tileSize * pos.row);
    p0.style.top = (tileSize * pos.row) + unit;
    p0.style.left = (tileSize * pos.col) + unit;



    board[tileZero.row][tileZero.col] = board[pos.row][pos.col];
    board[pos.row][pos.col] = 0;
    tileZero = pos;

}

function newTile(row, col, value) {
    var tile = document.createElement("button");
    ////function StyledTile(tile) {
    tile.id = "tile" + value;
    tile.className = "myButton";
    tile.style.position = "absolute";
    tile.style.left = (tileSize * col) + unit;
    tile.style.top = (tileSize * row) + unit;
    tile.style.width = (tileSize) + unit;
    tile.style.height = (tileSize) + unit;
    tile.style.backgroundImage = "url('')";
    tile.style.backgroundSize = w300 + unit + " " + w300 + unit;

    tile.style.backgroundPositionX = (-tileSize * col) + unit;
    tile.style.backgroundPositionY = (-tileSize * row) + unit;
    tile.innerHTML = value > 0 ? value : "";
    tile.onclick = function () { onClick(this); };

    return tile;
}

function Tile(pos) {
    var b = board[pos.row][pos.col];
    b = "tile" + b;
    return document.getElementById(b);// panelMain.Controls[b] as Panel;
}

function LocationToPosition(location) {
    //return pos
    var row = parseInt(location.style.top.replace(unit, "")) / tileSize;
    var col = parseInt(location.style.left.replace(unit, "")) / tileSize;
    //let myCar = new Car("Ford", 2014);
    return new Pos(row, col);
    //null;// new Pos() { row = location.Y / tileSize, col = location.X / tileSize };
}

class Pos {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

function readURL2() {
    var file = document.getElementById("getval").files[0];
    var reader = new FileReader();
    reader.onloadend = function () {

        for (var i = 0; i < n * n; i++) {
            var tile = document.getElementById("tile" + i);
            tile.style.backgroundImage = "url(" + reader.result + ")";
        }
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
    }
}

function RndFromTo(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function MixItNow(e) {
    mixing = true;
    var length = 100;
    for (var i = 0; i < length; i++) {
        //var  random.Next
        var rndPos = tileZero;
        var dir = RndFromTo(1, n * n);
        console.log(dir);
        var t = document.getElementById("tile" + dir);
        onClick(t);
    }
    mixing = false;
}
