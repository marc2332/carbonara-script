console.clear();
function convert(){
    const result = execute({
        code:carbonara.getValue(),
        compression:false,
        consoleOutput:true,
        execute:true
    });
    javascript.setValue(result);
}

let carbonara = CodeMirror(document.getElementById("carbonara"), {
    value: example,
    mode: "javascript",
    htmlMode: false,
    theme: "default",
    lineNumbers: true,
    autoCloseTags: true
});

let javascript = CodeMirror(document.getElementById("javascript"), {
value: "",
mode: "javascript",
htmlMode: false,
theme: "default",
lineNumbers: true,
autoCloseTags: true
});



