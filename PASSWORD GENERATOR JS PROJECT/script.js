
const passwordDisplay = document.querySelector("[data-password-display]");

const copyBtn = document.querySelector("[data-copy-btn]");
const copyMsg = document.querySelector("[data-copy-msg]");

const lengthDisplay = document.querySelector("[data-length-display]");
const lengthSlider = document.querySelector("[data-length-slider]");

const uppercaseCb = document.querySelector("#uppercaseCb");
const lowercaseCb = document.querySelector("#lowercaseCb");
const numberCb = document.querySelector("#numberCb");
const symbolCb = document.querySelector("#symbolCb");
const allCheckbox = document.querySelectorAll("input");   

const indicator = document.querySelector("[data-indicator]");

const generateButton = document.querySelector("#generateButton");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;

uppercaseCb.checked = true;
let checkCount = 1;


function handleSlider() {
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const max = lengthSlider.max;
    lengthSlider.style.backgroundSize =
      ((passwordLength ) * 100) / (max) + "% 100%";
}

handleSlider();

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateNumber(){
    return getRandomInteger(1, 10);
}

function generateLowercase(){
   return String.fromCharCode(getRandomInteger(97, 123));
}


function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}


function generateSymbol(){
    const randomIndex = getRandomInteger(0, symbols.length);
    return symbols.charAt(randomIndex);
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

setIndicator("#ccc");



function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if(uppercaseCb.checked) hasUpper = true;
    if(lowercaseCb.checked) hasLower = true;
    if(numberCb.checked) hasNumber = true;
    if(symbolCb.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}




async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } 

    
    catch (error) {
      copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
      copyMsg.classList.remove("active");
    }, 2000);
}
  
copyBtn.addEventListener("click", () => {
    if(passwordDisplay.value) copyContent();
});



lengthSlider.addEventListener('input', (e)=> {
    passwordLength = e.target.value;
    handleSlider();
}); 


allCheckbox.forEach( (checkbox) => {
    checkbox.addEventListener('change', countCheckedCb);
});

function countCheckedCb(){
    checkCount = 0;

    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked) checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}
  



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));
  
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    let str = "";
 
    str = array.join("");
    return str;
}


function generatePassword(){
   
    if(checkCount = 0){
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

   
    if (password.length) password = "";

    let funarr=[];
    
    if(uppercaseCb.checked) funarr.push(generateUppercase);
    if(lowercaseCb.checked) funarr.push(generateLowercase);
    if(numberCb.checked) funarr.push(generateNumber);
    if(symbolCb.checked) funarr.push(generateSymbol);

    
    for(let i=0; i < funarr.length; i++){
        password += funarr[i]();
    }

   
    for(let i=0; i < (passwordLength - funarr.length); i++){
        let randomIndex = getRandomInteger(0, funarr.length);
        password += funarr[randomIndex]();
    }

    
    password = shuffleArray(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
}

generateButton.addEventListener('click', generatePassword);