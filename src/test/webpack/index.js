// https://github.com/andreashuber69/async-css-plugin/blob/develop/README.md#----async-css-plugin

import "./style.css";

const component = () => {
    const element = document.createElement("h1");
    element.innerHTML = "Hello";
    element.classList.add("hello");
    return element;
};

document.body.append(component());
