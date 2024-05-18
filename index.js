document.addEventListener("DOMContentLoaded", function() {
    var returnToTopButton = document.getElementById('return-to-top');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            returnToTopButton.style.display = 'block';
        } else {
            returnToTopButton.style.display = 'none';
        }
    });

    returnToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
