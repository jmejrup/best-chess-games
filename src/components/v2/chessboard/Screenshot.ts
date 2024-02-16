namespace Screenshot{
    function Download(svgRoot:SVGSVGElement){
        let widthAndHeight = 500;
        let canvas = document.createElement("canvas");
        canvas.height = widthAndHeight;
        canvas.width = widthAndHeight;
        let image = document.createElement("img");
        image.style.display = "none";
        document.body.prepend(image);
        image.src = ConvertToImageUrl(svgRoot);

        image.onload = function () {
            canvas.getContext('2d')!.drawImage(image, 0, 0);
            const imageDataURL = canvas.toDataURL("image/png");
            triggerDownload(imageDataURL, "myboard.png");
            document.body.removeChild(image);
        };
    }
    function ConvertToImageUrl(svgRoot:SVGSVGElement){
        let xml = new XMLSerializer().serializeToString(svgRoot);
        let image64 = 'data:image/svg+xml;base64,' + btoa(xml);
        return image64;
    }
    function triggerDownload (imgURI:string, fileName:string) {
        var evt = new MouseEvent("click", {
          view: window,
          bubbles: false,
          cancelable: true
        });
        var a = document.createElement("a");
        a.setAttribute("download", fileName);
        a.setAttribute("href", imgURI);
        a.setAttribute("target", '_blank');
        a.dispatchEvent(evt);
    }
}
export default Screenshot