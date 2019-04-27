# Carbonara Script

This is a transcompiled language to javascript.

Just **TESTING**.

Exmaple:


``` 
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
``` 
will be converted to:

``` 
var var1 = "This is var1"; 
let var2 = "This is var2"; 
const var3 = "This is var3";

console.log(var1,"-",var2,"-",var3); 

function test (){ 
    console.log("Testing!!"); 
    function lol (x,v){ 
        console.log("loool!"); 
        } 
    lol ();
    } 
test ();

```
