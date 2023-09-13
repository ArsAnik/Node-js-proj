// date picker form
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