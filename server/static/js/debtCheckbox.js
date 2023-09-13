//hide fine balance in the admin table
let debt_checkbox = document.getElementById('debt_checkbox');
let fine_balance = document.getElementsByClassName('tableBlock_item__fine');
debt_checkbox.addEventListener("click", function (){
    if(debt_checkbox.checked){
        for(let i = 0; i < fine_balance.length; i++){
            fine_balance[i].classList.add('hide');
        }
    }else{
        for(let i = 0; i < fine_balance.length; i++){
            fine_balance[i].classList.remove('hide');
        }
    }
});