/*

Copyright 2019 Marc Espín Sanz

Check LICENSE.md 

*/

const execute = (input)=>{
    let data = {
        arrayed :input.code.replace(/(\r\n|\n|\r)/gm," ").split(/\s|(\[)([\w\s!?()="<>`[':.;_-{}]+)(\])|\s(\/\*)([\w\s!?()="<>`[':.;_-{}]+)(\*\/)|("[\w\s!?():=`.;_-{}]+")\s|(%%)([\w\s!?()="<>`[',.;_-{}]+)(%%)|("[\w\s!?()=.`;_-{}]+")/g),
        current_keyword: null,
        output:"",
        compression: input.compression==true? true:false,
        storedFunctions:[],
        storedVariables:[],
        storedDefinitions:[]
    } 
    data.arrayed = data.arrayed.filter(v=>v!='' && v!=undefined && v!=null); //Remove undeifned, empty strings and null from the input array
    console.log(data.arrayed)
    const getKeyWord = (i)=>{
        return data.arrayed[i];
    }
    const throwError = (message)=>{
        console.error(`Carbonara Error =>\n ${message}`);
    }
    const takeArguments = (text)=>{
        const object ={
            name:"",
            arguments:null
        }
        if(text==undefined) return object;
        if( !text.match(/[()]/g)) return object
        object.name = text.match(/([^(]+)/g)[0];
        object.arguments = text.match(/(?<=\().*?(?=\))/g)[0];
        return object;
    }
    const getBetween =(text)=>{
        return text.match(/(?<=\().*?(?=\))/g)[0];
    }
    const isWhat = (text)=>{
        if(text==undefined) return false;
        let _is;
        for(var i = 0; i<data.storedFunctions.length;i++){
            if(data.storedFunctions[i]==text.name) _is = "function";
        }
        if(_is!=undefined) return _is;
        for(var i = 0; i<data.storedVariables.length;i++){
            if(data.storedVariables[i].name==text) _is = "variable";
        }
        if(_is!=undefined) return _is;
        for(var i = 0; i<data.storedDefinitions.length;i++){
            if(data.storedDefinitions[i].name==text) _is = "definition";
        }
        return _is;
    }
    const getVariable = (text)=>{
        let varObj;
        for(var i = 0; i<data.storedVariables.length;i++){
            if(data.storedVariables[i].name==text) varObj = data.storedVariables[i];
        }
        return varObj;
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
        let openBrackets=1;
        for(let i=0;i<data.arrayed.length;i++){
            data.current_keyword = getKeyWord(i);
            switch (data.current_keyword){
                case "define":
                case "var":
                case "flex":
                case "final":
                    if( (getKeyWord(i+2)==":" && data.current_keyword =="final" )|| data.current_keyword !="final" &&  data.current_keyword !="define"){
                        data.storedVariables.push({
                            name:getKeyWord(i+1),
                            type: data.current_keyword
                        });
                        data.output+=`${'   '.repeat(openBrackets)} ${getVaribleType(data.current_keyword)} ${getKeyWord(i+1)} = ${getKeyWord(i+3)}; ${data.compression==true? "":"\n"}`;
                        i+=2;
                    }else{
                        
                        if(data.current_keyword == "define"){
                            data.storedDefinitions.push({
                                name:getKeyWord(i+1),
                                value:getKeyWord(i+3)
                            })
                            i+=3;
                        }else{
                            throwError(`Expected " : " on defining " ${data.current_keyword} " \n Example: ${data.current_keyword} test : "Example"`)
                            return;
                        }
                    }
                    break;
                case "def":
                    const name = takeArguments(getKeyWord(i+1)).name;
                    data.storedFunctions.push(name)
                    data.output+=`${'   '.repeat(openBrackets)}  ${name} = (${takeArguments(getKeyWord(i+1)).arguments}) => { ${data.compression==true? "":"\n"}`
                    i++;
                    openBrackets++;
                    break;
                case "if":
                    data.output+=`${'   '.repeat(openBrackets)} if(${getBetween(getKeyWord(i+1))}){\n`
                    i+=1
                    openBrackets++;
                    break;
                case "[":
                    if(isWhat(getKeyWord(i+1))=="definition"){
                        for( var a = 0; a<data.storedDefinitions.length;a++){
                            if(data.storedDefinitions[a].name==getKeyWord(i+1)){
                                data.output += `${'   '.repeat(openBrackets)}${data.storedDefinitions[a].value}\n`;
                            }    
                        }
                    }
                    break;
                case "}":
                    data.output+=`${'   '.repeat(openBrackets)}} ${data.compression==true? "":"\n"}`; 
                    openBrackets--; 
                    break;
                case "%%":
                    data.output+= getKeyWord(i+1)+"\n";
                    i+=2;
                    break;
                case "print":
                    data.output += `${'   '.repeat(openBrackets)} console.log(${getKeyWord(i+1)}); ${data.compression==true? "":"\n"}`
                    i++;
                    break;
                default: 
                    if(takeArguments(data.current_keyword).arguments!=null){
                        data.output += `${'   '.repeat(openBrackets)} ${takeArguments(data.current_keyword).name}(${takeArguments(data.current_keyword).arguments}); ${data.compression==true? "":"\n"}`;
                    }
                    if(isWhat(data.current_keyword)=="variable"){ //Redefine the value of the variable
                        if(getKeyWord(i+1)==":"){
                            if(getVariable(data.current_keyword).type=="final"){
                                throwError(`You can not modify the value of ${getKeyWord(i)}, once it's defined.`)
                                return;
                            }else{
                                data.output += `${'   '.repeat(openBrackets)} ${data.current_keyword} = ${getKeyWord(i+2)}; ${data.compression==true? "":"\n"}`;
                            }      
                        }
                    }
                    
            }
        }
        openBrackets = data.compression==true? 1:openBrackets;
        if(input.consoleOutput===true){
            console.log(`\n   <-- Code Output --> \n\n ${data.output} `);
        }
        if(openBrackets>1){
            throwError("Expected }.");
            return;
        }
        if(openBrackets<1){
            throwError("Found too many }. ");
            return;
        }
        if(input.execute) eval(data.output)
        return data.output;
    }
    return output();
}
//remove above code on production
const example=` 
define callTest : test()
var var1 : "This is var1" 
flex var2 : "This is var2"
final var3 : "This is var3"

var2 : "hola"

print var1,"-",var2,"-",var3

def test()
    print "Testing!!"
    def lol(x,v) 
        print "loool!"
    }
    lol()
}
[callTest]
%%
console.log("JavaScript in CarbonaraScript!!!");
%% 
`
const result = execute({
    code:example,
    compression:false,
    consoleOutput:true,
    execute:true
});

