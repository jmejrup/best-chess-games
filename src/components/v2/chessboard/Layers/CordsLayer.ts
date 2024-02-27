import SVG from "../SVG";

export default class CordsLayer{
    private group:SVGGElement;
    private horizontalGroup:SVGGElement;
    private verticalGroup:SVGGElement;
    private isRotated:boolean;

    constructor(svgRoot:SVGSVGElement, isRotated:boolean){
        this.isRotated = isRotated;
        this.group = SVG.createGroup();
        this.group.setAttribute("font-family", "Helvetica");
        this.group.setAttribute("font-weight", "bold");
        this.group.setAttribute("fill", "rgb(30,30,30");
        svgRoot.append(this.group);

        this.horizontalGroup = SVG.createGroup();
        this.verticalGroup = SVG.createGroup();

        this.group.appendChild(this.horizontalGroup);
        this.group.appendChild(this.verticalGroup);

        this.horizontalGroup.setAttribute("transform", "translate(86, 795.5)");
        this.verticalGroup.setAttribute("transform", "translate(5, 18)");

        this.getHorizontalCords(isRotated).forEach((letter, index) =>{
            let group = SVG.createGroup();
            group.setAttribute("transform", "translate(" + (index * 100).toString() + ",0)");
            this.horizontalGroup.appendChild(group);
            let text = SVG.createText(letter, "scale(0.9)");
            group.appendChild(text);
        });
        this.getVerticalCords(isRotated).forEach((number, index) =>{
            let group = SVG.createGroup();
            group.setAttribute("transform", "translate(0," + + (index * 100).toString() + ")");
            this.verticalGroup.appendChild(group);

            let text = SVG.createText(number, "scale(1)");
            group.appendChild(text);
        });
    }
    private getHorizontalCords(isRotated:boolean){
        let horizontalCords = ["A", "B", "C", "D", "E", "F", "G", "H"];
        return isRotated ? horizontalCords.reverse() : horizontalCords;
    }
    private getVerticalCords(isRotated:boolean){
        let verticalCords = ["8", "7", "6", "5", "4", "3", "2", "1"];
        return isRotated ? verticalCords.reverse() : verticalCords;
    }
    rotate(isRotated:boolean){
        this.isRotated = isRotated;
        let letters = this.getHorizontalCords(isRotated);
        let numbers = this.getVerticalCords(isRotated);
        Array.from(this.horizontalGroup.children).forEach((child, index) =>{
            child.children[0].textContent = letters[index];
        });
        Array.from(this.verticalGroup.children).forEach((child, index) =>{
            child.children[0].textContent = numbers[index];
        });
    }
}