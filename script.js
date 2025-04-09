// Obsługa menu mobilnego (hamburger)
const hamburgerButton = document.getElementById('hamburger-button');
const navElement = document.querySelector('nav'); // Zmieniono selektor na <nav>
// const navMenuWrapper = document.querySelector('.nav-menu-wrapper'); // Alternatywny selektor

if (hamburgerButton && navElement) { // Sprawdź istnienie navElement
    hamburgerButton.addEventListener('click', () => {
        // Przełącz klasę na elemencie <nav>
        navElement.classList.toggle('mobile-menu-active');

        // Przełącz klasę na przycisku hamburgera dla animacji X
        hamburgerButton.classList.toggle('open');

        // Alternatywa: przełączanie klasy na wrapperze menu
        // navMenuWrapper.classList.toggle('active');
    });

    // Opcjonalnie: Zamknij menu po kliknięciu linku w trybie mobilnym
    // (Może wymagać dostosowania selektorów do nowej struktury)
    const navLinks = navElement.querySelectorAll('.nav-menu-wrapper a'); // Znajdź linki wewnątrz wrappera
    if (navLinks.length > 0) {
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          // Sprawdź czy menu jest aktywne (czy nav ma klasę)
          if (navElement.classList.contains('mobile-menu-active')) {
            // Jeśli tak, usuń klasę z nav i hamburgera
            navElement.classList.remove('mobile-menu-active');
            hamburgerButton.classList.remove('open');
          }
        });
      });
    }
}

// Dynamiczne ustawienie roku w stopce (bez zmian)
const currentYearSpan = document.getElementById('current-year');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

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