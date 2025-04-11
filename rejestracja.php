<?php
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
    $username = $_POST["username"];
    $email = $_POST["email"];
    $password = $_POST["password"];
    $confirm_password = $_POST["confirm-password"];
    $terms = isset($_POST["terms"]); // Sprawdzenie, czy checkbox z regulaminem został zaznaczony

    // Walidacja danych
    $errors = array();

    // Sprawdzenie, czy wszystkie pola są wypełnione
    if (empty($username)) {
        $errors[] = "Nazwa użytkownika jest wymagana.";
    }
    if (empty($email)) {
        $errors[] = "Adres e-mail jest wymagany.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Nieprawidłowy format adresu e-mail.";
    }
    if (empty($password)) {
        $errors[] = "Hasło jest wymagane.";
    }
    if (empty($confirm_password)) {
        $errors[] = "Potwierdzenie hasła jest wymagane.";
    }
    if ($password !== $confirm_password) {
        $errors[] = "Hasła nie pasują do siebie.";
    }
    if (!$terms) {
        $errors[] = "Musisz zaakceptować Regulamin i Politykę Prywatności.";
    }

    // Sprawdzenie, czy nie ma błędów walidacji
    if (empty($errors)) {
        // Haszuj hasło i zapisz użytkownika do bazy danych
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $insert_query = "INSERT INTO accounts (login, password, email) VALUES (?, ?, ?)";
        $stmt_insert = $conn->prepare($insert_query);
        $stmt_insert->bind_param("sss", $username, $hashed_password, $email);

        if ($stmt_insert->execute()) {
            // Rejestracja udana - możesz przekierować użytkownika na stronę logowania lub wyświetlić komunikat
            echo '<p style="color: green;">Rejestracja zakończona pomyślnie! Możesz się teraz <a href="signin.html">zalogować</a>.</p>';
            // Możesz też użyć header("Location: signin.html"); exit();
        } else {
            echo '<p style="color: red;">Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.</p>';
            // Możesz dodać logowanie błędów: error_log("Błąd rejestracji: " . $stmt_insert->error);
        }
        $stmt_insert->close();
    } else {
        // Wyświetlenie błędów walidacji
        foreach ($errors as $error) {
            echo '<p style="color: red;">' . $error . '</p>';
        }
    }
}

$conn->close();
?>