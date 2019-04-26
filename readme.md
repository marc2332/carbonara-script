# Carbonara Script

This is a transcompiled language to javascript.

Just **TESTING**.

Exmaple:


``` 
temp hello : "TEST1" 
temp bye : "TEST2"

def test(x,y) 
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
print hello
``` 
will be converted to:

``` 
const hello = "TEST1"; 
const bye = "TEST2"; 

function test (x,y){
    const hello1 = "TEST1"; 
    const hello2 = "TEST2"; 
    const hello3 = "TEST3"; 
    function lol (x,v,z){
        const wow = "wooow"; 
        function lol (x,v){
            const wow = "wooow"; 
        }
    }
    console.log("hi");
}
console.log(hello);

```
