package com.example.demo;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    // Mapa que almacena usuarios conectados
    private Map<String, User> users = new HashMap<>();

    // Crear un nuevo usuario con su contraseña
    public String createUser(String username, String password) {
        if (users.containsKey(username)) {
            return "THE USER ALREADY EXISTS.";
        }
        users.put(username, new User(username, password, System.currentTimeMillis()));
        return "USER CREATED SUCCESSFULLY.";
    }

    // Eliminar un usuario
    public String deleteUser(String username) {
        if (users.containsKey(username)) {
            users.remove(username);
            return "USER DELETED SUCCESSFULLY.";
        }
        return "USER DOESN'T EXIST.";
    }

    // Actualizar la última vez que un usuario estuvo activo
    public void updateUserActivity(String username) {
        User user = users.get(username);
        if (user != null) {
            user.updateLastSeen();
        }
    }

    // Obtener un usuario por su nombre
    public User getUser(String username) {
        return users.get(username);
    }

    // Verificar las credenciales de un usuario
    public boolean authenticateUser(String username, String password) {
        User user = users.get(username);
        if (user != null) {
            return user.getPassword().equals(password); // Compara la contraseña
        }
        return false; // Usuario no encontrado o contraseña incorrecta
    }

    // Obtener todos los usuarios
    public Map<String, User> getAllUsers() {
        return users;
    }
}
