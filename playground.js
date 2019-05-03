console.clear();
var _executeBool = false;
var _autoCompileBool = true;
function convert(){
    const result = execute({
        code:carbonara.getValue(),
        compression:false,
        consoleOutput:false,
        execute:_executeBool
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

carbonara.on("change", function() {
    if(_autoCompileBool){
        console.clear()
        convert()
    }
});


function disableExecute(){
    if(_executeBool){
        _executeBool= false
    }else{
        _executeBool = true
    }
    convert()
}

function disableAutoCompile(){
    if(_autoCompileBool){
        _autoCompileBool= false
    }else{
        _autoCompileBool = true
    }
    convert()
}
