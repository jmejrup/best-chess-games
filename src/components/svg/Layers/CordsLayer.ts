const horizontalCords = ["A", "B", "C", "D", "E", "F", "G", "H"];
const verticalCords = ["8", "7", "6", "5", "4", "3", "2", "1"];

export default class CordsLayer{
    group:SVGGElement;
    horizontalGroup:SVGGElement;
    verticalGroup:SVGGElement;

    constructor(svgRoot:SVGSVGElement){
        this.group = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.group.setAttribute("font-family", "Helvetica");
        this.group.setAttribute("font-weight", "bold");
        this.group.setAttribute("fill", "rgb(30,30,30");
        svgRoot.append(this.group);

        this.horizontalGroup = document.createElementNS("http://www.w3.org/2000/svg","g");
        this.verticalGroup = document.createElementNS("http://www.w3.org/2000/svg","g");

        this.group.appendChild(this.horizontalGroup);
        this.group.appendChild(this.verticalGroup);

        this.horizontalGroup.setAttribute("transform", "translate(0.86, 7.955)");
        this.verticalGroup.setAttribute("transform", "translate(0.05, 0.18)");

        horizontalCords.forEach((letter, index) =>{
            let group = document.createElementNS("http://www.w3.org/2000/svg","g");
            group.setAttribute("transform", "translate(" + index.toString() + ",0)");
            this.horizontalGroup.appendChild(group);

            let text = document.createElementNS("http://www.w3.org/2000/svg","text");
            text.setAttribute("transform", "scale(0.009)");
            text.textContent = letter;
            group.appendChild(text);
        });
        verticalCords.forEach((number, index) =>{
            let group = document.createElementNS("http://www.w3.org/2000/svg","g");
            group.setAttribute("transform", "translate(0," + + index.toString() + ")");
            this.verticalGroup.appendChild(group);

            let text = document.createElementNS("http://www.w3.org/2000/svg","text");
            text.textContent = number;
            text.setAttribute("transform", "scale(0.010)");
            group.appendChild(text);
        });
    }
    rotate(isRotated:boolean){
        let letters = Array.from(horizontalCords);
        let numbers = Array.from(verticalCords);
        if (isRotated){
            letters.reverse();
            numbers.reverse();
        }
        Array.from(this.horizontalGroup.children).forEach((child, index) =>{
            child.children[0].textContent = letters[index];
        });
        Array.from(this.verticalGroup.children).forEach((child, index) =>{
            child.children[0].textContent = numbers[index];
        });
    }
}