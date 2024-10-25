export function readText(func) {
    const readFile = function(e) {
        let file = e.target.files[0]
        if(!file) {
            return;
        }
        let reader = new FileReader()
        reader.onload = func
        reader.readAsText(file)
    }
    const fileInput = document.createElement("input")
    fileInput.type = 'file'
    fileInput.style.display = 'none'
    fileInput.onchange = readFile
    document.body.appendChild(fileInput)
    fileInput.click()
}