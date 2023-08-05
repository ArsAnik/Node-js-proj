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