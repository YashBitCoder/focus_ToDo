const taskInfo = JSON.parse(localStorage.getItem("allTasks")) || {progressCnt: 0, totalTasks: 3};
let tasks = document.querySelectorAll("input[type='text']");
const taskListContainer = document.querySelector(".tasks-list");
const chkBoxes = document.querySelectorAll(".custom-chk");
const error = document.querySelector(".error-msg");
const progressBar = document.querySelector(".track-div");
const span = document.querySelector(".progress span");
const headline = document.querySelector("#headline");
const addBtn = document.querySelector(".add-task");
const removeBtn = document.querySelector(".remove-task");

const msgArr = [
    "Raise the bar by completing your goals!", 
    "Just a step away, keep going!",
    "Congrats all tasks Completed!!"
];

// removeBtn.classList.add("hide-btn");

for(let i = 4;  i <= taskInfo.totalTasks; i++) {
    addTask(i, false);
}

updateProgress();

function showError() {
    error.classList.add("show-error");
}

function resetState() {
    chkBoxes.forEach((el) => {
        el.parentElement.classList.remove("comp");
        const id = el.nextElementSibling.id;

        if(taskInfo[id] && taskInfo[id].completed) {
            taskInfo[id].completed = false;
            taskInfo["progressCnt"]--;
        }
    })

    localStorage.setItem("allTasks", JSON.stringify(taskInfo));
    updateProgress();
}

function updateProgress() {
    const cnt = taskInfo["progressCnt"];

    progressBar.style.width = `${(taskInfo["progressCnt"] / tasks.length) * 100}%`;
    span.innerText = `${cnt}/${tasks.length} Completed`;

    if(taskInfo["progressCnt"] === 0) headline.innerText = msgArr[0];
    else if(taskInfo["progressCnt"] === tasks.length) headline.innerText = msgArr[2];
    else headline.innerText = msgArr[1];
}

function addTask(cnt, canReset) {
    const clonedTask = tasks[0].parentElement.cloneNode(true);
    clonedTask.children[0].classList.remove("focused");
    clonedTask.classList.remove("comp");
    clonedTask.children[1].id = `task${cnt}`;
    clonedTask.children[1].value = "";
    addInpEvents(clonedTask.children[1]);
    addChkEvents(clonedTask.children[0]);
    taskListContainer.append(clonedTask);

    tasks = document.querySelectorAll("input[type='text']");

    localStorage.setItem("allTasks", JSON.stringify(taskInfo));
    updateProgress();
    if(canReset) resetState();

    removeBtn.classList.remove("hide-btn");
    if(taskInfo.totalTasks === 5) addBtn.classList.add("hide-btn");
}

function removeTask() {
    if(taskInfo[taskListContainer.lastElementChild.children[1].id].completed) taskInfo["progressCnt"]--;
    delete taskInfo[taskListContainer.lastElementChild.children[1].id];
    taskInfo.totalTasks--;
    taskListContainer.removeChild(taskListContainer.lastElementChild);
    tasks = document.querySelectorAll("input[type='text']");
    localStorage.setItem("allTasks", JSON.stringify(taskInfo));
    updateProgress();

    addBtn.classList.remove("hide-btn");
    if(taskInfo.totalTasks === 3) removeBtn.classList.add("hide-btn");
}

function addInpEvents(el) {
    if(taskInfo[el.id] && taskInfo[el.id].val) {
        el.value = taskInfo[el.id].val;
        el.previousElementSibling.classList.add("focused");
    }

    el.addEventListener("focus", () => {
        error.classList.remove("show-error");
        el.previousElementSibling.classList.add("focused");
    })

    el.addEventListener("blur", () => {
        if(!el.value) {
            el.previousElementSibling.classList.remove("focused");
            resetState();
        }
    })

    el.addEventListener("input", (e) => {
        if(taskInfo[el.id] && taskInfo[el.id].completed) {
            el.value = taskInfo[el.id].val;
            return;
        }

        if(!taskInfo[e.target.id]) {
            taskInfo[e.target.id] = {
                val: el.value,
                completed: false
            }
        }

        taskInfo[e.target.id].val = el.value;
        localStorage.setItem("allTasks", JSON.stringify(taskInfo));
    })
}

function addChkEvents(el) {
    if(taskInfo[el.nextElementSibling.id] && taskInfo[el.nextElementSibling.id].completed) el.parentElement.classList.add("comp");

    el.addEventListener("click", (e) => {
        const fieldChk = [...tasks].every((inp) => {
            return inp.value;
        });

        if(fieldChk) {
            el.parentElement.classList.toggle("comp");
            const id = el.nextElementSibling.id;

            if(el.parentElement.classList.contains("comp")) {
                taskInfo["progressCnt"]++;
                
                if(!taskInfo[id]) {
                    taskInfo[id] = {
                        val: "",
                        completed: true
                    };
                }
                else taskInfo[id].completed = true;
            }

            else {
                taskInfo[id].completed = false;
                taskInfo["progressCnt"]--;
            }

            localStorage.setItem("allTasks", JSON.stringify(taskInfo));
            updateProgress();
        }
        else showError();
    })
}

chkBoxes.forEach(addChkEvents);

tasks.forEach(addInpEvents);

addBtn.addEventListener("click", () => {
    addTask(++taskInfo.totalTasks, true);
});

removeBtn.addEventListener("click", removeTask)














// const tasks = document.querySelectorAll("#tk");
// const chkBoxes = document.querySelectorAll(".custom-chk");
// const error = document.querySelector(".error-msg");
// const progressBar = document.querySelector(".track-div");
// const span = document.querySelector(".progress span");
// const headline = document.querySelector("#headline");
// let cnt = 0;

// function resetState() {
//     for(let i = 0; i < tasks.length; i++) {
//         tasks[i].classList.remove("mark-inp");
//         chkBoxes[i].classList.remove("mark-chk");
//     }
    
//     cnt = 0;
//     span.innerText = `0/3 Completed`;
//     progressBar.style.width = `0%`;
//     headline.innerText = `Raise the bar by completing your goals!`;
// }

// function showError() {
//     error.classList.add("show-error");
// }

// function removeError() {
//     error.classList.remove("show-error");
// }

// tasks.forEach((el) => {
//     const chk = el.previousElementSibling;

//     el.addEventListener("focus", () => {
//         removeError();
//         chk.classList.add("focused");
//     })

//     el.addEventListener("blur", () => {
//         if(el.value === "") {
//             chk.classList.remove("focused");
//             resetState();
//         }
//     })
// })

// chkBoxes.forEach((el) => {
//     el.addEventListener("click", () => {
//         const fieldChk = [...tasks].every((inp) => {
//             return inp.value;
//         });

//         if(fieldChk) {
//             if(el.classList.length === 2) cnt++;
//             else cnt--;

//             span.innerText = `${cnt}/3 Completed`;
//             progressBar.style.width = `${cnt * 33.33}%`;

//             el.classList.toggle("mark-chk");
//             el.nextElementSibling.classList.toggle("mark-inp");

//             let raiseMsg = "";

//             if(cnt === 0) raiseMsg = "Raise the bar by completing your goals!";
//             else if(cnt === 3) raiseMsg = "Congrats all tasks Completed!!"
//             else raiseMsg = "Just a step away, keep going!";

//             headline.innerText = raiseMsg;
//         }
//         else showError();
//     })
// 
// })