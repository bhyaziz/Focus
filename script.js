document.addEventListener("DOMContentLoaded", function () {
    // Sélectionner les formulaires
    const loginForm = document.querySelector('form[action="/login"]');
    const signupForm = document.querySelector('form[action="/signup"]');

    // Validation pour le formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            // Récupérer les valeurs des champs
            const email = loginForm.querySelector('#email').value;
            const password = loginForm.querySelector('#password').value;

            // Validation simple
            if (!email || !password) {
                event.preventDefault(); // Empêche l'envoi du formulaire
                alert("Veuillez remplir tous les champs.");
            }
        });
    }

    // Validation pour le formulaire d'inscription
    if (signupForm) {
        signupForm.addEventListener('submit', function (event) {
            // Récupérer les valeurs des champs
            const username = signupForm.querySelector('#username').value;
            const email = signupForm.querySelector('#email').value;
            const password = signupForm.querySelector('#password').value;

            // Validation simple
            if (!username || !email || !password) {
                event.preventDefault(); // Empêche l'envoi du formulaire
                alert("Veuillez remplir tous les champs.");
            }
        });
    }

    // Gestion de l'élément "Se connecter" ou "S'inscrire" dans la page d'accueil
    const loginButton = document.querySelector('.auth-button:nth-child(1)');
    const signupButton = document.querySelector('.auth-button:nth-child(2)');

    if (loginButton) {
        loginButton.addEventListener('click', function () {
            window.location.href = 'login.html'; // Rediriger vers la page de connexion
        });
    }

    if (signupButton) {
        signupButton.addEventListener('click', function () {
            window.location.href = 'signup.html'; // Rediriger vers la page d'inscription
        });
    }
});
