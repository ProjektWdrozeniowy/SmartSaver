// src/views/PrivacyPolicyPage.jsx
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

const PrivacyPolicyPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0d1a2a 0%, #1a0d1f 100%)',
          py: { xs: 8, md: 10 },
          px: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            component={motion.h1}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem' },
              mb: 2,
              color: 'text.primary',
              fontWeight: 700,
            }}
          >
            Polityka Prywatności
          </Typography>
          <Typography
            component={motion.p}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: 'text.secondary',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Twoja prywatność jest dla nas priorytetem
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 6, md: 8 },
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <Paper
            component={motion.div}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            sx={{
              p: { xs: 3, sm: 5 },
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              '& section:not(:last-child)': {
                mb: 6,
              },
            }}
          >
            {/* Date */}
            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Ostatnia aktualizacja: 03.12.2025 r.
            </Typography>

            {/* Wprowadzenie */}
            <Box component="section">
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                1. Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych pozyskanych za pośrednictwem strony internetowej <strong>Smart$aver</strong>, zwanej dalej: „Stroną internetową".
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                2. Właścicielem strony i jednocześnie Administratorem danych jest <strong>Smart$aver sp. z o.o., 80-266 Gdańsk, aleja Grunwaldzka 238A, NIP: 12345678</strong>, zwany dalej Administratorem.
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                3. Dane osobowe zbierane przez Administratora za pośrednictwem Strony internetowej są przetwarzane zgodnie z <strong>Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679</strong> z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (<strong>ogólne rozporządzenie o ochronie danych</strong>), zwane również <strong>RODO</strong>.
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                4. Administrator dokłada szczególnej staranności do poszanowania prywatności Klientów odwiedzających Stronę internetową.
              </Typography>
            </Box>

            {/* § 1 Rodzaj przetwarzanych danych */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                § 1 Rodzaj przetwarzanych danych, cele oraz podstawa prawna
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                <strong>1.</strong> Administrator zbiera informacje dotyczące osób fizycznych dokonujących czynności prawnej niezwiązanej bezpośrednio z ich działalnością, osób fizycznych prowadzących we własnym imieniu działalność gospodarczą lub zawodową oraz osób fizycznych reprezentujących osoby prawne lub jednostki organizacyjne niebędące osobami prawnymi, którym ustawa przyznaje zdolność prawną, prowadzące we własnym imieniu działalność gospodarczą lub zawodową, zwanych dalej łącznie <strong>Klientami</strong>.
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                <strong>2.</strong> Administrator przetwarza dane osobowe Klientów w zakresie korzystania z usługi formularza kontaktowego na Stronie internetowej w celu niezbędnym do wykonania umowy lub podjęcia działań przed jej zawarciem – podstawa przetwarzania z art. 6 ust. 1 lit. b RODO
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                <strong>3.</strong> W przypadku skorzystania z usługi formularza kontaktowego, Klient podaje następujące dane:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}><strong>adres e-mail</strong></Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}><strong>imię</strong></Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}><strong>numer telefonu</strong></Typography></li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                <strong>4.</strong> Podczas korzystania ze Strony internetowej mogą być pobierane dodatkowe informacje, w szczególności: adres IP przypisany do komputera Klienta lub zewnętrzny adres IP dostawcy Internetu, nazwa domeny, rodzaj przeglądarki, czas dostępu, typ systemu operacyjnego. Od Klientów mogą być także gromadzone dane nawigacyjne, w tym informacje o linkach i odnośnikach, w które zdecydują się kliknąć lub innych czynnościach, podejmowanych na Stronie internetowej w celach związanych ze świadczeniem usług, a także w celach technicznych i administracyjnych oraz analitycznych i statystycznych - w tym zakresie podstawą przetwarzania także jest art. 6 ust. 1 lit. f RODO, tj. niezbędność do celów wynikających z prawnie uzasadnionego interesu Administratora, jakim jest zapewnienie bezpieczeństwa informatycznego i zarządzania Stroną internetową oraz poprawa funkcjonalności Strony internetowej i świadczonych usług.
              </Typography>
            </Box>

            {/* § 2 Odbiorcy danych */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                § 2 Odbiorcy danych
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                <strong>1.</strong> Dane osobowe Klienta przekazywane są dostawcom usług, z których korzysta Administrator przy prowadzeniu Strony internetowej. Dostawcy usług, którym przekazywane są dane osobowe, w zależności od uzgodnień umownych i okoliczności, albo podlegają poleceniom Administratora, co do celów i sposobów przetwarzania tych danych (<strong>podmioty przetwarzające</strong>) albo samodzielnie określają cele i sposoby ich przetwarzania (<strong>administratorzy</strong>).
              </Typography>

              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                    <strong>1.1. Podmioty przetwarzające.</strong> Administrator korzysta z dostawców, którzy przetwarzają dane osobowe wyłącznie na polecenie Administratora. Należą do nich m.in. dostawcy świadczący usługę hostingu, usługi księgowe, dostarczający systemy do marketingu, systemy do analizy ruchu na Stronie internetowej, systemy do analizy skuteczności kampanii marketingowych
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    <strong>1.2. Administratorzy.</strong> Administrator korzysta z dostawców, którzy nie działają wyłącznie na polecenie i sami ustalają cele i sposoby wykorzystania danych osobowych Klientów. Świadczą oni usługi płatności elektronicznych oraz bankowe.
                  </Typography>
                </li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                <strong>2. Lokalizacja.</strong> Dostawcy usług mają siedzibę głównie w Polsce i w innych krajach Europejskiego Obszaru Gospodarczego (EOG).
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                3. W przypadku skierowania żądania Administrator udostępnia dane osobowe uprawnionym organom państwowym, w szczególności jednostkom organizacyjnym Prokuratury, Policji, Prezesowi Urzędu Ochrony Danych Osobowych, Prezesowi Urzędu Ochrony Konkurencji i Konsumentów lub Prezesowi Urzędu Komunikacji Elektronicznej.
              </Typography>
            </Box>

            {/* § 3 Okres przechowywania danych */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                § 3 Okres przechowywania danych
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                <strong>1.</strong> Dane osobowe Klientów przechowywane są:
              </Typography>

              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                    1.1. W przypadku, gdy podstawą przetwarzania danych osobowych jest zgoda wówczas dane osobowe Klienta przetwarzane są przez Administratora tak długo, aż zgoda nie zostanie odwołana, a po odwołaniu zgody przez okres czasu odpowiadający okresowi przedawnienia roszczeń jakie może podnosić Administrator i jakie mogą być podnoszone wobec niego. Jeżeli przepis szczególny nie stanowi inaczej, termin przedawnienia wynosi lat sześć, a dla roszczeń o świadczenia okresowe oraz roszczeń związanych z prowadzeniem działalności gospodarczej - trzy lata.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    1.2. W przypadku, gdy podstawą przetwarzania danych jest wykonanie umowy, wówczas dane osobowe Klienta przetwarzane są przez Administratora tak długo, jak jest to niezbędne do wykonania umowy, a po tym czasie przez okres odpowiadający okresowi przedawnienia roszczeń. Jeżeli przepis szczególny nie stanowi inaczej, termin przedawnienia wynosi lat sześć, a dla roszczeń o świadczenia okresowe oraz roszczeń związanych z prowadzeniem działalności gospodarczej - trzy lata.
                  </Typography>
                </li>
              </Box>
            </Box>

            {/* § 4 Mechanizm cookies */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                § 4 Mechanizm cookies, adres IP
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                1. Strona internetowa używa niewielkich plików, zwanych cookies. Zapisywane są one przez Administratora na urządzeniu końcowym osoby odwiedzającej Stronę internetową, jeżeli przeglądarka internetowa na to pozwala. Plik cookie zwykle zawiera nazwę domeny, z której pochodzi, swój „czas wygaśnięcia" oraz indywidualną, losowo wybraną liczbę identyfikującą ten plik. Informacje zbierane za pomocą plików tego typu pomagają dostosowywać oferowane przez Administratora produkty do indywidualnych preferencji i rzeczywistych potrzeb osób odwiedzających Stronę internetową
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                2. Administrator wykorzystuje dwa typy plików cookies:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                    <strong>2.1. Cookies sesyjne:</strong> po zakończeniu sesji danej przeglądarki lub wyłączeniu komputera zapisane informacje są usuwane z pamięci urządzenia. Mechanizm cookies sesyjnych nie pozwala na pobieranie jakichkolwiek danych osobowych ani żadnych informacji poufnych z komputerów Klientów.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    <strong>2.2. Cookies trwałe:</strong> są przechowywane w pamięci urządzenia końcowego Klienta i pozostają tam do momentu ich skasowania lub wygaśnięcia. Mechanizm cookies trwałych nie pozwala na pobieranie jakichkolwiek danych osobowych ani żadnych informacji poufnych z komputera Klientów.
                  </Typography>
                </li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                3. Administrator wykorzystuje cookies własne w celu:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    3.1. analiz i badań oraz audytu oglądalności, a w szczególności do tworzenia anonimowych statystyk, które pomagają zrozumieć, w jaki sposób Klienci korzystają ze Strony internetowej, co umożliwia ulepszanie jej struktury i zawartości.
                  </Typography>
                </li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                4. Administrator wykorzystuje cookies zewnętrzne w celu:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    4.1. prezentowania na stronach informacyjnych Strony, mapy wskazującej lokalizację biura Administratora, za pomocą serwisu internetowego maps.google.com (administrator cookies zewnętrznego: Google Inc z siedzibą w USA)
                  </Typography>
                </li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                5. Mechanizm cookies jest bezpieczny dla komputerów Klientów odwiedzających Stronę internetową. W szczególności tą drogą nie jest możliwe przedostanie się do komputerów Klientów wirusów lub innego niechcianego oprogramowania lub oprogramowania złośliwego. Niemniej w swoich przeglądarkach Klienci mają możliwość ograniczenia lub wyłączenia dostępu plików cookies do komputerów. W przypadku skorzystania z tej opcji korzystanie ze Strony internetowej będzie możliwe, poza funkcjami, które ze swojej natury wymagają plików cookies.
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                6. Administrator może gromadzić adresy IP Klientów. Adres IP to numer przydzielany komputerowi osoby odwiedzającej Stronę internetową przez dostawcę usług internetowych. Numer IP umożliwia dostęp do Internetu. W większości przypadków jest przypisywany komputerowi dynamicznie, tj. zmienia się przy każdym połączeniu z Internetem i z tego powodu traktowany jest powszechnie, jako nieosobista informacja identyfikująca. Adres IP jest wykorzystywany przez Administratora przy diagnozowaniu problemów technicznych z serwerem, tworzeniu analiz statystycznych (np. określeniu, z jakich regionów notujemy najwięcej odwiedzin), jako informacja przydatna przy administrowaniu i udoskonalaniu Strony internetowej, a także w celach bezpieczeństwa oraz ewentualnej identyfikacji obciążających serwer, niepożądanych automatycznych programów do przeglądania treści Strony internetowej.
              </Typography>
            </Box>

            {/* § 5 Prawa osób */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                § 5 Prawa osób, których dane dotyczą
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                Osobom, których dane są przetwarzane przysługuje:
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
                1. Prawo cofnięcia w dowolnym momencie zgody na przetwarzanie danych:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>1.1. Klient ma prawo do cofnięcia każdej zgody, jakiej udzielił</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>1.2. Cofnięcie zgody ma skutek od momentu wycofania zgody</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>1.3. Wycofanie zgody nie wpływa na zgodność z prawem przetwarzania, którego dokonano na podstawie zgody przed jej wycofaniem</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>1.4. Cofnięcie zgody nie pociąga za sobą dla Klienta żadnych negatywnych konsekwencji, może jednak uniemożliwić dalsze korzystanie z usług lub funkcjonalności, które zgodnie z prawem Administrator może świadczyć jedynie za zgodą</Typography></li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
                2. Prawo do sprzeciwu wobec przetwarzania danych:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>2.1. Klient ma prawo w dowolnym momencie wnieść sprzeciw - z przyczyn związanych z jego szczególną sytuacją - wobec przetwarzania jego danych osobowych, opartego na art. 6 ust. 1 lit. e) lub f) RODO, w tym profilowania na podstawie tych przepisów. Administratorowi nie wolno już przetwarzać tych danych osobowych, chyba że wykaże on istnienie ważnych prawnie uzasadnionych podstaw do przetwarzania, nadrzędnych wobec interesów, praw i wolności osoby, której dane dotyczą, lub podstaw do ustalenia, dochodzenia lub obrony roszczeń</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>2.2. Rezygnacja w formie wiadomości e-mail z otrzymywania komunikatów marketingowych dotyczących produktów lub usług, będzie oznaczać sprzeciw Klienta na przetwarzanie jego danych osobowych, w tym profilowania w tych celach</Typography></li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
                3. Prawo do usunięcia danych („prawo do bycia zapomnianym"):
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.1. Klient ma prawo do żądania usunięcia wszystkich lub niektórych danych osobowych</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>3.2. Klient ma prawo żądania usunięcia danych osobowych, jeżeli:</Typography></li>
                <Box component="ul" sx={{ pl: 4, mb: 1 }}>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.2.1. dane osobowe nie są już niezbędne do celów, w których zostały zebrane lub w których były przetwarzane</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.2.2. wycofał określoną zgodę, w zakresie w jakim dane osobowe były przetwarzane w oparciu o jego zgodę</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.2.3. wniósł sprzeciw na mocy art. 21 ust. 1 RODO wobec przetwarzania i nie występują nadrzędne prawnie uzasadnione podstawy przetwarzania lub wniósł sprzeciw na mocy art. 21 ust. 2 RODO wobec przetwarzania</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.2.4. dane osobowe są przetwarzane niezgodnie z prawem</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.2.5. dane osobowe muszą zostać usunięte w celu wywiązania się z obowiązku prawnego przewidzianego w prawie Unii lub prawie Państwa członkowskiego, któremu Administrator podlega</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.2.6. dane osobowe zostały zebrane w związku z oferowaniem usług społeczeństwa informacyjnego</Typography></li>
                </Box>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>3.3. Pomimo żądania usunięcia danych osobowych, w związku z wniesieniem sprzeciwu lub wycofaniem zgody, Administrator może zachować pewne dane osobowe w zakresie, w jakim przetwarzanie jest niezbędne do ustalenia, dochodzenia lub obrony roszczeń, jak również do wywiązania się z prawnego obowiązku wymagającego przetwarzania na mocy prawa Unii lub prawa państwa członkowskiego, któremu podlega Administrator. Dotyczy to w szczególności danych osobowych obejmujących: imię, nazwisko, adres e-mail, które to dane zachowywane są dla celów rozpatrywania skarg oraz roszczeń związanych z korzystaniem z usług Administratora, czy też dodatkowo adresu zamieszkania/adresu korespondencyjnego, numeru zamówienia, które to dane zachowywane są dla celów rozpatrywania skarg oraz roszczeń związanych z zawartymi umowami sprzedaży lub świadczeniem usług</Typography></li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
                4. Prawo do ograniczenia przetwarzania danych:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>4.1. Klient ma prawo do żądania ograniczenia przetwarzania jego danych osobowych. Zgłoszenie żądania, do czasu jego rozpatrzenia uniemożliwia korzystanie z określonych funkcjonalności lub usług, z których korzystanie będzie się wiązało z przetwarzaniem danych objętych żądaniem. Administrator nie będzie też wysyłał żadnych komunikatów, w tym marketingowych</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>4.2. Klient ma prawo do żądania ograniczenia wykorzystania danych osobowych w następujących przypadkach:</Typography></li>
                <Box component="ul" sx={{ pl: 4, mb: 1 }}>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>4.2.1. gdy kwestionuje prawidłowość swoich danych osobowych – wówczas Administrator ogranicza ich wykorzystanie na czas potrzebny do sprawdzenia prawidłowości danych, nie dłużej jednak niż na 7 dni</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>4.2.2. gdy przetwarzanie danych jest niezgodne z prawem, a zamiast usunięcia danych Klient zażąda ograniczenia ich wykorzystania</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>4.2.3. gdy dane osobowe przestały być niezbędne do celów, w których zostały zebrane lub wykorzystywane ale są one potrzebne Klientowi w celu ustalenia, dochodzenia lub obrony roszczeń</Typography></li>
                  <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>4.2.4. gdy osoba, której dane dotyczą wniosła sprzeciw wobec przetwarzania jego danych – do czasu stwierdzenia, czy prawnie uzasadnione podstawy po stronie administratora są nadrzędne wobec podstaw sprzeciwu osoby, której dane dotyczą</Typography></li>
                </Box>
              </Box>

                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
            5. Prawo żądania od Administratora dostępu do swoich danych osobowych oraz otrzymania ich kopii:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>5.1. Klient ma prawo uzyskać od Administratora potwierdzenie, czy przetwarza dane osobowe, a jeżeli ma to miejsce, Klient ma prawo:</Typography></li>
            <Box component="ul" sx={{ pl: 4, mb: 1 }}>
              <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>5.1.1. uzyskać dostęp do swoich danych osobowych</Typography></li>
              <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>5.1.2. uzyskać informacje o celach przetwarzania, kategoriach przetwarzanych danych osobowych, o odbiorcach lub kategoriach odbiorców tych danych, planowanym okresie przechowywania danych Klienta albo o kryteriach ustalania tego okresu (gdy określenie planowanego okresu przetwarzania danych nie jest możliwe), o prawach przysługujących Klientowi na mocy RODO oraz o prawie wniesienia skargi do organu nadzorczego, jeżeli dane osobowe nie zostały zebrane od osoby, której dane dotyczą – wszelkie dostępne informacje o ich źródle, o zautomatyzowanym podejmowaniu decyzji, w tym o profilowaniu o którym mowa w art. 22 ust. 1 i 4 RODO, oraz – przynajmniej w tych przypadkach – istotne informacje o zasadach ich podejmowania, a także o znaczeniu i przewidywanych konsekwencjach takiego przetwarzania dla osoby, której dane dotyczą oraz o zabezpieczeniach stosowanych w związku z przekazaniem danych osobowych poza Unię Europejską</Typography></li>
              <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>5.1.3. uzyskać kopię swoich danych osobowych. Prawo do uzyskania kopii nie może niekorzystnie wpływać na prawa i wolności innych</Typography></li>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
            6. Prawo do sprostowania (poprawiania) danych:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>6.1. Klient ma prawo do żądania od Administratora niezwłocznego sprostowania dotyczących jego danych osobowych, które są nieprawidłowe. Z uwzględnieniem celów przetwarzania, Klient, którego dane dotyczą ma prawo żądania uzupełnienia niekompletnych danych osobowych, w tym przez przedstawienie dodatkowego oświadczenia, kierując prośbę na adres poczty elektronicznej zgodnie z §6 Polityki Prywatności</Typography></li>
          </Box>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
            7. Prawo do przenoszenia danych:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>7.1. Klient ma prawo otrzymać swoje dane osobowe, które dostarczył Administratorowi, a następnie przesłać je do innego, wybranego przez siebie, administratora danych osobowych. Klient ma również prawo żądać, by dane osobowe zostały przesłane przez Administratora bezpośrednio takiemu administratorowi, o ile jest to technicznie możliwe. W takim przypadku Administrator prześle dane osobowe Klienta w postaci pliku w formacie csv, który jest formatem powszechnie używanym, nadającym się do odczytu maszynowego i pozwalającym na przesłanie otrzymanych danych do innego administratora danych osobowych</Typography></li>
          </Box>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1, fontWeight: 600 }}>
            8. Prawo wniesienia skargi do organu nadzorczego:
          </Typography>
          <Box component="ul" sx={{ pl: 4, mb: 2 }}>
            <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>8.1. Klientowi przysługuje prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, w zakresie naruszenia jego praw do ochrony danych osobowych lub innych praw przyznanych na mocy RODO</Typography></li>
          </Box>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
            9. W sytuacji wystąpienia przez Klienta z uprawnieniem wynikającym z powyższych praw, Administrator spełnia żądanie albo odmawia jego spełnienia niezwłocznie, nie później jednak niż w ciągu miesiąca po jego otrzymaniu. Jeżeli jednak - z uwagi na skomplikowany charakter żądania lub liczbę żądań – Administrator nie będzie mógł spełnić żądania w ciągu miesiąca, spełni je w ciągu kolejnych dwóch miesięcy informując Klienta uprzednio w terminie miesiąca od otrzymania żądania - o zamierzonym przedłużeniu terminu oraz jego przyczynach
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            10. Klient może zgłaszać do Administratora skargi, zapytania i wnioski dotyczące przetwarzania jego danych osobowych oraz realizacji przysługujących mu uprawnień
          </Typography>
        </Box>

        {/* § 6 Zmiany */}
        <Box component="section">
          <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
            § 6 Zmiany Polityki Prywatności
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
            <strong>1.</strong> Polityka Prywatności może ulec zmianie, o czym Administrator nie ma obowiązku informować.
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
            <strong>2.</strong> Pytania związane z Polityką Prywatności prosimy kierować na adres e-mail:{' '}
            <Box
              component="a"
              href="mailto:kontakt@smartsaver.pl"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              kontakt@smartsaver.pl
            </Box>
          </Typography>
        </Box>
        </Paper>
        </Container>
        </Box>

      <Footer />
      <ScrollToTop />
    </Box>
  );
};

export default PrivacyPolicyPage;