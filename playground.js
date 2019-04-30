console.clear();
function convert(){
    const result = execute({
        code:document.getElementById("carbonara").innerText,
        compression:false,
        consoleOutput:true,
        execute:true
    });
    document.getElementById("javascript").innerText = result;
}

function exampleLoad(){
    document.getElementById("carbonara").children[0].children[0].innerText = example;
}


