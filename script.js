let screen = document.querySelector("#screen h1");
let equals = document.querySelector("#equals");
let clear = document.querySelector("#clear");
let buttons = document.querySelectorAll(".button");
let num = document.querySelectorAll(".number");
let func = document.querySelectorAll(".func");

const display = (nums) => {
    if (typeof nums !== "number") {
        screen.textContent = "error";
        return;
    } else if (nums.toString().includes(".") && nums.toString().length > 10) {
        screen.textContent = Number.parseFloat(nums).toFixed(7);
    } else if (nums.toString().length > 14) {
        screen.textContent = Number.parseInt(nums).toExponential([8]);
    }
    else {
        screen.textContent = nums;
    }
}

Array.from(buttons).forEach(button => 
    button.addEventListener("click", e => {
        if (e.target.hasAttribute("data-key")) {
            if (screen.textContent === "0" || screen.textContent === ""){
                if (e.target.id === "decimal") {
                    screen.textContent = "0.";
                } else if (screen.textContent === "" && e.target.classList.contains("func")) {
                    screen.textContent = "";
                }
                else {
                screen.textContent = e.target.getAttribute("data-key");
                }
            } else {
                if (e.target.classList.contains("func") && screen.textContent.charAt(screen.textContent.length -1).match(/[\+\-\/\*\.]/)) {
                    screen.textContent = screen.textContent.slice(0, screen.textContent.length - 1);
                    screen.textContent += (e.target.getAttribute("data-key"));
                } else if ((e.target.id == "decimal" && (/\.(?!\d*[\*\/\+\-])/g.test(screen.textContent)))) {
                    screen.textContent = screen.textContent;
                } else {
                    screen.textContent += (e.target.getAttribute("data-key"));
                }
            }
    }})
);

let clearFunc = () => screen.textContent = "";

clear.addEventListener("click", () => clearFunc());

let execute = (operation) => {
    let arr = operation.replace(/\+/g, ",+,").replace(/\-/g, ",-,").replace(/\*/g, ",*,").replace(/\//g, ",/,").split(",");
    const multDiv = (index) => {
        if (arr[index] == "*"){
        arr.splice(arr.indexOf("*") - 1, 3, `${Number(arr[arr.indexOf("*") - 1]) * Number(arr[arr.indexOf("*") + 1])}`);
        } else {
            arr.splice(arr.indexOf("/") - 1, 3, `${Number(arr[arr.indexOf("/") - 1]) / Number(arr[arr.indexOf("/") + 1])}`);
        }
    }
    const addSub = (index) => {
        if (arr[index] == "+"){
            arr.splice(arr.indexOf("+") - 1, 3, `${Number(arr[arr.indexOf("+") - 1]) + Number(arr[arr.indexOf("+") + 1])}`);
            } else {
                arr.splice(arr.indexOf("-") - 1, 3, `${Number(arr[arr.indexOf("-") - 1]) - Number(arr[arr.indexOf("-") + 1])}`);
            }
    }

    while (arr.length > 1){
        if (arr.includes("*") || arr.includes("/")) {
            multDiv(arr.findIndex(item => item.match(/\*|\//)));
            continue;
        }
        if (arr.includes("+") || arr.includes("-")) {
            addSub(arr.findIndex(item => item.match(/\+|\-/)));
            continue;
        }
    }
    return Number(arr[0]);
}

const afterEquals = (e) => {
        if (e.target.classList.contains("number") || e.target.classList.contains("decimal")) {
            if (e.target.id == "decimal") {
                screen.textContent = "0.";
            } else {
                screen.textContent = e.target.getAttribute("data-key");
            }
            buttons.forEach(btn => btn.removeEventListener("click", afterEquals));
        } else buttons.forEach(btn => btn.removeEventListener("click", afterEquals));
    }

equals.addEventListener("click", () => {
    display(execute(screen.textContent));
    if (screen.textContent == "Infinity") {
        screen.textContent = "Are you trying to kill me, dude?";
    }
    buttons.forEach(btn => btn.addEventListener("click", afterEquals));
    });
