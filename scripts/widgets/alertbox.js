// toggle alert on when called, and toggle it away again after awhile
function alert(string, img_src) {
    let box = $$.query(".alert");
    let gears = $$.query(".alert-gears");

    box.setAttribute("style", "transform: translateY(0px)");
    gears.setAttribute("style", "translate: 0px -70px");

    box.children[0].src = "images/"+img_src;
    box.children[2].innerText = string;

    setTimeout(() => {
        box.removeAttribute("style", "transition-delay: 0s;");
        gears.setAttribute("style", "translate: 0px -250px; transition-delay: 1s;");
    }, 8000);
}
