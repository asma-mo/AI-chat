import bot from "./assets/bot.svg";
import user from "./assets/user.svg";


const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
// const submit = document.getElementsByName("sumbit-button");

let loadInterval;

function loader(element){
  element.textContent = "";

  loadInterval = setInterval(function () {
    element.textContent += ".";

    if (element.textContent === "...."){
      element.textContent = "";
    }
  }, 300);
}

function typeText(element , text){
  let index = 0;
  
  let interval = setInterval(() => {
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    }else{
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomnumber = Math.random();
  const hexaDecimalString = randomnumber.toString(16);

  return "id-"+timestamp+"-"+hexaDecimalString; //or return `id-${timestamp}-${hexaDecimalString}`; 
}

function chatStripe(isAi, value, uniqueId) {
  return(
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img 
              src="${isAi ? bot : user}" 
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>${value} </div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {

  e.preventDefault(); //To prevent the page from default udating every time we click "submit" button

  const data = new FormData(form);

  //user's chatStrip e
  chatContainer.innerHTML += chatStripe(false,data.get("prompt"))

  form.reset();

  //AI's chatStripe
  const uniqueId = generateUniqueId();

  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  var messageDev = document.getElementById(uniqueId);
  
  loader(messageDev);

  const response = await fetch("http://localhost:9000",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: data.get("prompt")
    })
  }) ;

  clearInterval(loadInterval);
  messageDev.innerHTML="";

  if(response.ok) { //if the status between 200 & 299 will be true else means false
    const data = await response.json();   //the data beeing send is in Json format
    const parsedData = data.bot.trim();

   typeText(messageDev,parsedData)
  }else{
    const err = await response.text();   //the error we get is definetly will be Text
    messageDev = "Ooh Something went wrong..";
    alert(err);
  }
}

form.addEventListener("submit",handleSubmit);
form.addEventListener("keyup", function (e) {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
})

