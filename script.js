// Obsługa menu mobilnego (hamburger)
const hamburgerButton = document.getElementById('hamburger-button');
const navUl = document.querySelector('nav ul');

if (hamburgerButton && navUl) {
    hamburgerButton.addEventListener('click', () => {
        navUl.classList.toggle('active'); // Pokaż/Ukryj menu
        hamburgerButton.classList.toggle('open'); // Dodaj/Usuń klasę dla animacji X
    });

    // Zamykanie menu po kliknięciu na link (dla stron typu one-page)
    navUl.querySelectorAll('a').forEach(link => {
        // Dodajemy warunek, aby nie zamykać menu dla linków do zewnętrznych stron (np. Sign In/Sign Up)
        if (link.getAttribute('href').startsWith('#')) {
             link.addEventListener('click', () => {
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    hamburgerButton.classList.remove('open');
                }
            });
        }
    });
}


// Dynamiczne ustawienie roku w stopce
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Prosta obsługa formularza kontaktowego (jeśli zdecydujesz się go dodać z powrotem)
/*
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Thank you for your message! (This is a demo - message not sent).');
        contactForm.reset();
    });
}
*/

// Opcjonalnie: Zmiana stylu nagłówka podczas przewijania (dostosowana do dark mode)
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Jeśli przewinięto
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.9)'; // Może być nieco bardziej kryjący
             header.style.borderBottom = '1px solid #444'; // Może wyraźniejsza linia
        } else {
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.8)'; // Powrót do pierwotnej przezroczystości
             header.style.borderBottom = '1px solid var(--border-color)'; // Powrót do pierwotnej linii
        }
    });
}


// Płynne przewijanie (jeśli CSS `scroll-behavior: smooth;` nie wystarcza)
/*
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Można dodać offset, aby uwzględnić wysokość nagłówka
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

             // Prostsza wersja bez offsetu:
            // targetElement.scrollIntoView({
            //     behavior: 'smooth',
            //     block: 'start'
            // });
        }
    });
});
*/