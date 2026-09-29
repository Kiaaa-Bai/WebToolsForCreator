document.body.addEventListener('mousemove', (ev) => {
    let {clientX, clientY} = ev;

    let mySquare = document.getElementById('mySquare')
    mySquare.style.top = clientY - 50 + "px"
    mySquare.style.left = clientX - 50 + "px"

})

document.body.addEventListener()