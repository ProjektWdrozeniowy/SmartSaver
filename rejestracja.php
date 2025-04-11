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
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $insert_query = "INSERT INTO accounts (login, password, email) VALUES (?, ?, ?)";
        $stmt_insert = $conn->prepare($insert_query);
    
        if ($stmt_insert) {
            $stmt_insert->bind_param("sss", $username, $hashed_password, $email);
    
            if ($stmt_insert->execute()) {
                $_SESSION['registration_success'] = "Rejestracja zakończona pomyślnie! Możesz się teraz zalogować.";
                header("Location: signin.html");
                exit();
            } else {
                echo '<p style="color: red;">Błąd podczas rejestracji: ' . $stmt_insert->error . '</p>';
            }
    
            $stmt_insert->close(); // ✔️ Tylko jeśli $stmt_insert istnieje
        } else {
            echo '<p style="color: red;">Błąd przygotowania zapytania: ' . $conn->error . '</p>';
        }
    } else {
        foreach ($errors as $error) {
            echo '<p style="color: red;">' . $error . '</p>';
        }
    }
}


$conn->close();
?>