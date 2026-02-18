//DOM//
document.addEventListener("DOMContentLoaded",function(){

    let form = document.getElementById("contactForm");
    if(!form) return;

    let nameInput = document.getElementById("name");
    let emailInput = document.getElementById("email");
    let msgInput = document.getElementById("message");


    let nameErr = document.getElementById("nameErr");
    let emailErr = document.getElementById("emailErr");
    let msgErr = document.getElementById("msgErr");

    let successMsg = this.document.getElementById("successMsg");
    if (!nameInput || !emailInput || !msgInput || !nameErr || !emailErr || !msgErr || !successMsg) return;

    function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

    function clearErrors(){
        nameErr.textContent = "";
        emailErr.textContent = "";
        msgErr.textContent = "";

        nameInput.removeAttribute("aria-invalid");
        emailInput.removeAttribute("aria-invalid");
        msgInput.removeAttribute("aria-invalid");

        successMsg.classList.add("hidden");
    }

    form.addEventListener("submit", function(e){
        e.preventDefault();

        clearErrors();
        let ok = true;

        if(nameInput.value.trim().length < 2){
            nameErr.textContent = "please else your name(at least 2 characters).";
            nameInput.setAttribute("aria-invalid", "true");
            ok = false;
        }

        if(!isValidEmail(emailInput.value)){
            emailErr.textContent = "please else a valid email.";
            emailInput.setAttribute("aria-invalid", "true");
            ok = false;
        }

        if(msgInput.value.trim().length < 10){
            msgErr.textContent = "please write at least 10 characters.";
            msgInput.setAttribute("aria-invalid", "true");
            ok = false;
        }

        if(!ok) return;

        form.reset();
        successMsg.classList.remove("hidden");

    });

    })