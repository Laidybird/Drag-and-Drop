//initial refernces
let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = [
 "belgium",
 "bhutan", 
 "brazil",
  "china", 
  "cuba", 
  "ecuador", 
  "georgia", 
  "germany", 
  "hong-kong",
  "india", 
  "iran", 
  "myanmar", 
  "norway", 
  "spain", 
  "sri-lanka", 
  "sweden", 
  "switzerland", 
  "united-states", 
  "uruguay", 
  "wales"];

  let deviceType = "";
  let initialX = 0;
  let initialY = 0;
  let currentElement = "";
  let moveElement = false;


  //Detect touch device

  const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;

    }catch (e) {
        deviceType = "mouse";
        return false;

    }
  };
    let count = 0;

//Random value from array
const randomValueGenerator = () => {
    return data[Math.floor(Math.random() * data.length)];
};
console.log(randomValueGenerator());

//Win game display

const stopGame = () => {
    controls.classList.remove("hide");
    startButton.classList.remove("hide");
};

//Drag and Drop functions

function dragStart(e){
    if(isTouchDevice()){
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
//start movement for touch
    moveElement = true;
    currentElement = e.target;
    }else{
//For nontouch devices set data to be transfered
    e.dataTransfer.setData("text", e.target.id);
    }
}

//Events fired on the drop target

function dragOver(e){
    e.preventDefault();
}

//For touchscreen movement 
const touchMove = (e) => {
    if(moveElement){
        e.preventDefault();
        let newX = e.touches[0].clientX;
        let newY = e.touches[0].clientY;
        let currentSelectedElement = document.getElementById(e.target.id);
        currentSelectedElement.parentElement.style.top =
        currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
        currentSelectedElement.parentElement.style.
        left = currentSelectedElement.parentElement.offsetLeft - (initialX - newX) + "px";
        initialX = newX;
        initialY = newY;

    }
};
const drop = (e) => {
    e.preventDefault();
//For touchscreen
if(isTouchDevice()){
    moveElement = false;
//Select country name using the country attribute
     const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
//Get boundaries of div
     const currentDropBound = currentDrop.getBoundingClientRect();
//If the position of flags falls inside the bounds of the country name
     if(
        initialX >= currentDropBound.left &&
        initialX <= currentDropBound.right &&
        initialY >= currentDropBound.top &&
        initialY <= currentDropBound.bottom 

     ){
        currentDrop.classList.add("dropped");
        //hide actual image
        currentElement.classList.add("hide");
        currentDrop.innerHTML = ``;
        //Insert new game
        currentDrop.insertAdjacentHTML("afterbegin",`<img src="${currentElement.id}.png">` );
        count += 1;
     }
}
    else{
//Acces data
        const draggedElementData = e.dataTransfer.getData("text");
//Get custom attribute value
        const droppableElementData = e.target.getAttribute("data-id");
        if(draggedElementData === droppableElementData){
            const draggedElement = document.getElementById(draggedElementData);
//dropped class
        e.target.classList.add("dropped");
//hide current image
        draggedElement.classList.add("hide");
//draggable set to false 
         draggedElement.setAttribute("draggable", "false");
         e.target.innerHTML = ``;
//INSERT NEW IMG 
         e.target.insertAdjacentHTML("afterbegin", `<img src="${draggedElementData}.png">`);
         count += 1;
        }
    }
    //win
    if(count == 3) {
        result.innerText = `You Won!`;
        stopGame();
    }
};

//Creates flags countries
    const creator = () => {
        dragContainer.innerHTML = "";
        dropContainer.innerHTML = "";
        let randomData = [];
//for strings random values in array
     for(let i = 1; i <= 3; i++){
        let randomValue = randomValueGenerator();
        if(!randomData.includes(randomValue)){
           randomData.push(randomValue);
        }else{
//If value alredy exists then decrement i by 1
        i -= 1;
        }
     }
    for(let i  of randomData){
        const flagDiv = document.createElement("div");
        flagDiv.classList.add("draggable-image");
        flagDiv.setAttribute("draggable", true);
    if(isTouchDevice()){
        flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
    dragContainer.appendChild(flagDiv);
    }
//sort the array randomly before creating country divs
    randomData = randomData.sort(() => 0.5 - Math.random());
    for(let i of randomData){
        const countryDiv = document.createElement("div")
        countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
        ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", "")}
        </div>
        `;
        dropContainer.appendChild(countryDiv);
    }
    };

//Start game
startButton.addEventListener("click", (stargGame = async () => {
    currentElement = "";
    controls.classList.add("hide");
    startButton.classList.add("hide");
    await creator();
    count = 0;
    dropPoints = document.querySelectorAll(".countries");
    draggableObjects = document.querySelectorAll("draggable-image");

    //Events

    draggableObjects.forEach((element) => {
        element.addEventListener("dragStart", dragStart);

    //For touch screen

    element.addEventListener("touchstart", dragStart);
    element.addEventListener("touchend", drop);
    element.addEventListener("touchmove", touchMove);
    });
    dropPoints.forEach((element) => {
        element.addEventListener("dragover", dragOver);
        element.addEventListener("drop", drop);
    })
}))