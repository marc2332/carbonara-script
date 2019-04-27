/*

Copyright 2019 Marc Espín Sanz

Check LICENSE.md 

*/

const execute = (input)=>{
    let data = {
        arrayed :input.code.replace(/(\r\n|\n|\r)/gm," ").split(/\s(?=)|("[\w\s!?()=_-{}]+")/g),
        current_keyword: null,
        output:"",
        compression: input.compression==true? true:false,
        storedFunctions:[]
    } 
    data.arrayed = data.arrayed.filter(v=>v!='' && v!=undefined && v!=null); //Remove undeifned, empty strings and null from the input array
    const getKeyWord = (i)=>{
        return data.arrayed[i];
    }
    const throwError = (message)=>{
        console.error(`CarbonaraScript Error: ${message}`);
    }
    const takeArguments = (text)=>{
        
        const object ={
            name:"",
            arguments:""
        }
        if(text==undefined) return object;
        if( !text.match(/[()]/g)) return undefined
        object.name = text.match(/([^(]+)/g)[0];
        object.arguments = text.match(/(?<=\().*?(?=\))/g)[0];
        return object;
    }
    const isFunction = (text)=>{
        if(text==undefined) return false;
        let _is;
        for(var i = 0; i<data.storedFunctions.length;i++){
            if(data.storedFunctions[i]==text.name) _is = true;
        }
        return _is;
    }
    const getVaribleType = (keyword)=>{
        switch (keyword){
            case"var":
                return "var"
                break;
            case "final":
                return "const"
                break;
            case "flex":
                return "let";
                break;
        }
    }
    const output = (_compression)=>{
        let openFunctions=1;
        for(let i=0;i<data.arrayed.length;i++){
            data.current_keyword = getKeyWord(i);
            switch (data.current_keyword){
                case "var":
                case "flex":
                case "final":
                    data.output+=`${'   '.repeat(openFunctions)} ${getVaribleType(data.current_keyword)} ${getKeyWord(i+1)} = ${getKeyWord(i+3)}; ${data.compression==true? "":"\n"}`;
                    break;
                case "def":
                    data.storedFunctions.push(takeArguments(getKeyWord(i+1)).name);
                    data.output+=`${'   '.repeat(openFunctions)} function ${takeArguments(getKeyWord(i+1)).name} (${takeArguments(getKeyWord(i+1)).arguments}){ ${data.compression==true? "":"\n"}`
                    i++;
                    openFunctions++;
                    break;
                case "}":
                    data.output+=`${'   '.repeat(openFunctions)}} ${data.compression==true? "":"\n"}`; 
                    openFunctions--; 
                    break;
                case "print":
                    data.output += `${'   '.repeat(openFunctions)} console.log(${getKeyWord(i+1)}); ${data.compression==true? "":"\n"}`
                default: 
                    if(isFunction(takeArguments(data.current_keyword))){
                        data.output += `${'   '.repeat(openFunctions)} ${takeArguments(data.current_keyword).name} (${takeArguments(data.current_keyword).arguments});\n`;
                    }
            }
        }
        openFunctions = data.compression==true? 1:openFunctions;
        if(input.consoleOutput===true){
            console.log(`\n   <-- Output --> \n\n ${data.output} `);
        }
        if(openFunctions>1){
            throwError("Expected }.");
            return;
        }
        if(openFunctions<1){
            throwError("Found too many }. ");
            return;
        }
        eval(data.output)
        return data.output;
    }
    return output();
}
const result = execute({
    code:`

    var var1 : "This is var1" 
    flex var2 : "This is var2"
    final var3 : "This is var3"
    
    print var1,"-",var2,"-",var3

    def test()
        print "Testing!!"
        def lol(x,v) 
            print "loool!"
        }
        lol()
    }
    test()
    
    `,
    compression:false,
    consoleOutput:false
});