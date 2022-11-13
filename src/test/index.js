import "./style.css"

function component() {
    const element = document.createElement('h1');
    element.innerHTML = "Hello";
    element.classList.add("hello");
    return element;
}

document.body.appendChild(component());