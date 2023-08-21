function show_error(message){
    let error_block = document.getElementById("errorPopUp");
    error_block.textContent = message;
    error_block.classList.add("active");
    error_block.addEventListener("animationend", function (){
        error_block.classList.remove("active");
    });
}

let forms = document.getElementsByTagName('form');
for(let i = 0; i < forms.length; i++){
    forms[i].addEventListener('submit', function (event) {
        event.preventDefault();
        const form_data = Object.fromEntries(new FormData(event.target).entries());
        const handle_path = forms[i].getAttribute("action");
        fetch(handle_path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form_data),
        })
            .then(response => response.json())
            .then(data => {
                if(data.is_stand){
                    show_error(data.error);
                }else{
                    window.location.replace(data.redirect);
                }
            });
    });
}

let phones = document.getElementsByClassName('phoneMask');
let mask_options = {
    mask: '+7(000)000-00-00',
    lazy: false
}
let masks_phone = [];
for(let i = 0; i < phones.length; i++){
    masks_phone.push(new IMask(phones[i], mask_options));
}

let date_start = document.getElementById('dateStart');
let date_end = document.getElementById('dateEnd');
let date_submit = document.getElementById('dateSubmit');
let date_all_time = document.getElementById('dateAll');

function show_period_operations() {
    let value_date_start = new Date(date_start.value);
    let value_date_end = new Date(date_end.value);

    if(!(value_date_start instanceof Date) || isNaN(value_date_start)){
        show_error("Введите начало периода");
    }
    else if(!(value_date_end instanceof Date) || isNaN(value_date_end)){
        show_error("Введите конец периода");
    }
    else if(value_date_start > value_date_end){
        show_error("Неправильно введён период");
    }
    else {
        let history_item = document.getElementsByClassName('history_item');
        let cur_date = new Date();

        for(let i = 0; i < history_item.length; i++){
            cur_date = new Date(history_item[i].getAttribute("dvalue"));
            if(cur_date > value_date_end || cur_date < value_date_start){
                history_item[i].classList.add('hide');
            }else{
                history_item[i].classList.remove('hide');
            }
        }

    }
}

date_all_time.addEventListener("click", function (){
    let history_item = document.getElementsByClassName('history_item');
    for(let i = 0; i < history_item.length; i++){
        history_item[i].classList.remove('hide');
    }
    date_start.value = '';
    date_end.value = '';
});

date_end.addEventListener("change", show_period_operations);
date_submit.addEventListener("click", show_period_operations);