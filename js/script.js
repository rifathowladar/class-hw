let button = document.querySelector('.btn')
let box = document.querySelector('.box')
let list = document.querySelector('.list')
let ubtn = document.querySelector('.ubtn')

let taskList = [];
let uindex ;

button.addEventListener('click',function(){
    taskList.push(box.value);
    display();
})

function display(){
    list.innerHTML = "";
    for(let i = 0; i < taskList.length; i++){
        list.innerHTML += `<li>${taskList[i]} <button class="edit-btn Abtn">Edet</button> <button class="delete-btn Fbtn">Delete</button> </li>`;
    }
    let deleteBtn = document.querySelectorAll(".delete-btn");
    let dltArr = Array.from(deleteBtn);
    let editBtn = document.querySelectorAll(".edit-btn");
    let editArr = Array.from(editBtn);

    dltArr.map((btn, index) => {
        btn.addEventListener("click", function () {
            taskList.splice(index, 1);
            display();
        })
    })

    editArr.map((btn, index) => {
        btn.addEventListener("click", function (){
            box.value = taskList[index];
            uindex = index ;
            ubtn.style.display = "inline-block" ;
            button.style.display = "none" ;
        })
    })
}

ubtn.addEventListener('click', function(){
    taskList[uindex] = box.value ;
    display()
    button.style.display = "inline-block" ;
    ubtn.style.display = "none" ;
})
