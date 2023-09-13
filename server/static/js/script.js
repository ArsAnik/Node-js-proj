// show error block in the page
function show_error(message){
    let error_block = document.getElementById("errorPopUp");
    error_block.textContent = message;
    error_block.classList.add("active");
    error_block.addEventListener("animationend", function (){
        error_block.classList.remove("active");
    });
}

// add ajax to every form
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
                if(data.is_error){
                    show_error(data.error);
                }else{
                    window.location.replace(data.redirect);
                }
            });
    });
}