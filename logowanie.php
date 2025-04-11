<?php
session_start(); // Rozpoczęcie sesji - ważne do przechowywania informacji o zalogowanym użytkowniku

// Połączenie z bazą danych
$host = 'localhost'; // Zmień na swój host bazy danych
$db_user = 'root'; // Zmień na nazwę użytkownika bazy danych
$db_password = ''; // Zmień na hasło do bazy danych
$db_name = 'rejestracja'; // Nazwa Twojej bazy danych

$conn = new mysqli($host, $db_user, $db_password, $db_name);

// Sprawdzenie połączenia
if ($conn->connect_error) {
    die("Błąd połączenia z bazą danych: " . $conn->connect_error);
}

// Sprawdzenie, czy formularz został wysłany metodą POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Pobranie danych z formularza
    $email = $_POST["email"];
    $password = $_POST["password"];

    // Walidacja danych (czy pola nie są puste)
    if (empty($email)) {
        $error = "Adres e-mail jest wymagany.";
    } elseif (empty($password)) {
        $error = "Hasło jest wymagane.";
    } else {
        // Zapytanie do bazy danych w celu znalezienia użytkownika o podanym e-mailu
        $query = "SELECT id, login, password FROM accounts WHERE email = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $hashed_password_from_db = $row["password"];

            // Weryfikacja hasła
            if (password_verify($password, $hashed_password_from_db)) {
                // Logowanie udane - ustaw zmienne sesji
                $_SESSION["loggedin"] = true;
                $_SESSION["user_id"] = $row["id"];
                $_SESSION["username"] = $row["login"];

                // Przekierowanie na stronę główną (zmień na właściwy adres)
                header("Location: index.html"); // Możesz przekierować gdziekolwiek chcesz po zalogowaniu
                exit();
            } else {
                $error = "Nieprawidłowy adres e-mail lub hasło.";
            }
        } else {
            $error = "Nieprawidłowy adres e-mail lub hasło.";
        }

        $stmt->close();
    }

    // Wyświetlenie komunikatu o błędzie, jeśli wystąpił
    if (isset($error)) {
        echo '<p style="color: red;">' . $error . '</p>';
    }
}

$conn->close();
?>