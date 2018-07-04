
export default function Output(element, fontSize, fontColor, string) {
    let output = document.getElementById(element);
    output.style.fontSize = fontSize;//10 +'pt';
    output.style.color = fontColor;
    output.innerHTML = string;
}