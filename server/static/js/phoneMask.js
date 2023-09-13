// add phone mask
let phones = document.getElementsByClassName('phoneMask');
let mask_options = {
    mask: '+7(000)000-00-00',
    lazy: false
}
let masks_phone = [];
for(let i = 0; i < phones.length; i++){
    masks_phone.push(new IMask(phones[i], mask_options));
}