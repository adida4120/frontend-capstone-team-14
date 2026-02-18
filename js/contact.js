"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    // Defined all inputs and error fields clearly
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const msgInput = document.getElementById("message");

    const nameErr = document.getElementById("nameErr");
    const emailErr = document.getElementById("emailErr");
    const msgErr = document.getElementById("msgErr");

    const successMsg = document.getElementById("successMsg");

    // Safety check: ensure all elements exist before running
    if (!nameInput || !emailInput || !msgInput || !nameErr || !emailErr || !msgErr || !successMsg) return;

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    function clearErrors() {
        nameErr.textContent = "";
        emailErr.textContent = "";
        msgErr.textContent = "";
        nameInput.removeAttribute("aria-invalid");
        emailInput.removeAttribute("aria-invalid");
        msgInput.removeAttribute("aria-invalid");
        successMsg.classList.add("hidden");
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        clearErrors();
        let ok = true;

        if (nameInput.value.trim().length < 2) {
            nameErr.textContent = "Please enter your full name (at least 2 characters).";
            nameInput.setAttribute("aria-invalid", "true");
            ok = false;
        }

        if (!isValidEmail(emailInput.value)) {
            emailErr.textContent = "Please enter a valid email address.";
            emailInput.setAttribute("aria-invalid", "true");
            ok = false;
        }

        if (msgInput.value.trim().length < 10) {
            msgErr.textContent = "Please write at least 10 characters.";
            msgInput.setAttribute("aria-invalid", "true");
            ok = false;
        }

        if (!ok) return;

        // Reset and show success
        form.reset();
        successMsg.classList.remove("hidden");
        console.log("Contact form successfully submitted");
    });
});