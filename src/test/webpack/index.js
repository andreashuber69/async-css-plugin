// eslint-disable-next-line import/no-unassigned-import
import "./style.css";

const component = () => {
    const element = document.createElement("h1");
    element.innerHTML = "Hello";
    element.classList.add("hello");

    return element;
};

document.body.appendChild(component());
