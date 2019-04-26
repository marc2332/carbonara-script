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
        console.error(message);
    }
    const takeArguments = (text)=>{
        const object ={
            name:"",
            arguments:""
        }
        if(text==undefined) return object;
        if( !text.match(/[()]/g)) return undefined
        object.name = text.match(/([^(]+)/g)[0];
        object.arguments = text.match(/\((.*?)\)/g)[0];
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
    console.log(data.arrayed)
    const output = (_compression)=>{
        let openFunctions=1;
        for(let i=0;i<data.arrayed.length;i++){
            data.current_keyword = getKeyWord(i);
            openFunctions = data.compression==true? 0:openFunctions;
            switch (data.current_keyword){
                case "temp":
                    data.output+=`${'   '.repeat(openFunctions)} const ${getKeyWord(i+1)} = ${getKeyWord(i+3)}; ${data.compression==true? "":"\n"}`;
                    break;
                case "def":
                    data.storedFunctions.push(takeArguments(getKeyWord(i+1)).name);
                    data.output+=`${'   '.repeat(openFunctions)} function ${takeArguments(getKeyWord(i+1)).name} ${takeArguments(getKeyWord(i+1)).arguments}{ ${data.compression==true? "":"\n"}`
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
                        data.output += `${'   '.repeat(openFunctions)} ${takeArguments(data.current_keyword).name} (${takeArguments(getKeyWord(i+1)).arguments});\n`;
                    }
            }
        }
        if(openFunctions>1){
            throwError("Expected }.");
            return;
        }
        if(openFunctions<1){
            throwError("Found too many }.");
            return;
        }
        if(input.consoleOutput===true){
            console.log(`\n   <--Result-- > \n\n ${data.output} `);
        }
        eval(data.output)
        return data.output;
    }
    return output();
}
const result = execute({
    code:`
    temp start : "Hello World!a" 
    temp bye : "TEST2"
    
    def test(x,y,a,h) 
        temp hello1 : "TEST1" 
        temp hello2 : "TEST2" 
        temp hello3 : "TEST3" 
        def lol(x,v,z) 
            temp wow : "wooow" 
            def lol(x,v) 
                temp wow : "wooow" 
            }
        } 
        print "hi"
    }
    print bye,start

    def send(message)
        print message
    }

    test()
    `,
    compression:false,
    consoleOutput:true
});