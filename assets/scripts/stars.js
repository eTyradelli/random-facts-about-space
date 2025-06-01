"use strict";

for (let i = 0; i < 3; i++){
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("stars");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    for (let i = 0; i < 200; ++i){
        let cx = Math.round(Math.random() * 10000) / 100 + '%';
        let cy = Math.round(Math.random() * 10000) / 100 + '%';
        let r = Math.round((Math.random() + 0.5) * 10) / 10;
        let star = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        star.classList.add("star");
        star.setAttribute("cx", cx);
        star.setAttribute("cy", cy);
        star.setAttribute("r", r);
        svg.appendChild(star);
    }
    starsWrapper.appendChild(svg);
}


