import "./style.css"

function component() {
    const element = document.createElement('h1');
    element.innerHTML = "Test";
    return element;
}

document.body.appendChild(component());