console.clear();

const HomeAct = new activity({name:"Home",code:`

    <d-navbar position="top" content="left"> 
        <d-tabs class="ripple" >Home</d-tabs>
        <d-tabs class="ripple" onclick="openAboutAct()">About</d-tabs>
    </d-navbar>	
    <d-content>	
    <div class="card">
        <p>Only works on chromium-base browsers</p>
        <i class="spacer"></i>
        <div class="blam">
            <div class="blam">
                <a>Show errors on result?</a>
                <input onchange="disableErrors()" checked type="checkbox"  >
            </div>
            <div class="blam">
                <a>Execute?</a>
                <input onchange="disableExecute()"  type="checkbox"  >
            </div>
            <div class="blam">
                <a>Auto compile?</a>
                <input onchange="disableAutoCompile()"  checked type="checkbox"  >
            </div>
            <button class="ripple" onclick="convert()">RUN</button>
        </div>
    </div>
		
        <div class="card">
            <div class="horizontal">
                <div contentEditable="true"  class="input" id="carbonara"></div>
                <dconfigtEditable="true" class="input" id="javascript"></div>
            </div>
        </div>

	</d-content>

`});
const colors = {
    Name : 'main',
    Primary : '#2979ff',
    Light: '#75a7ff',
    Secondary: '#1565c0',
    Background: '#2d2d2d',
    RippleEffect : 'rgba(255,255,255,0.6)'
}
newTheme(colors)
setTheme("main");	
load({
    home: HomeAct
});

function openAboutAct(){
	const aboutAct = new activity({name:"about",code:`

			
			<d-navbar position="top">
					<img class="navbar-icon" onclick="closeActivity('slide_down')" src="arrow_back.svg"></img>
					<navbar-title> About Carbonara <navbar-title>
			</d-navbar>
            <d-content>
                <div content="center">
                    <p class="title2">CarbonaraScript</p>
                    <p> Version 0.1.2</p>
                    <button class="ripple" onclick="window.open('https://github.com/marc2332/carbonara-script')">Source</button>
                    <button class="ripple" onclick="window.open('https://github.com/marc2332/carbonara-script/blob/master/changelog.md')">Changelog</button>
                </div>
			</d-content>
	`});
	aboutAct.launch({
  	animation:"slide_up"
  })
}

var _executeBool = false;
var _showErrors = true;
var _autoCompileBool = true;
function convert(){
    const result = execute({
        code:carbonara.getValue(),
        compression:false,
        consoleOutput:false,
        execute:_executeBool,
        showErrorsOnPlayground:_showErrors
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

function disableErrors(){
    if(_showErrors){
        _showErrors= false
    }else{
        _showErrors = true
    }
    convert()
}

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
