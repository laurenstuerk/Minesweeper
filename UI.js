function dropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}



function ModeToggle() {
    document.body.classList.toggle('darkmode');
    const dropbtn = document.getElementById("dropbtn");
    const infobtn = document.getElementById("info");
    if (document.body.classList.contains('darkmode')) {
        dropbtn.style.filter = "invert(1)";
        infobtn.style.filter = "invert(1)";
    } else {
        dropbtn.style.filter = "invert(0)";
        infobtn.style.filter = "invert(0)";
    }

}


function info(){
    const gameGuide = document.getElementById("game-guide");
    const grid = document.getElementById("grid");
    if (gameGuide.style.display === "block") {
        gameGuide.style.display = "none";
        grid.style.display = "flex";
    } else {
        gameGuide.style.display = "block";
        grid.style.display = "none";
    }
}

