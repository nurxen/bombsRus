package com.example.demo;

public class User {
    private String username;
    private String password; // Nuevo campo para la contraseña
    private long lastSeen;

    // Constructor con la contraseña
    public User(String username, String password, long lastSeen) {
        this.username = username;
        this.password = password;
        this.lastSeen = lastSeen;
    }

    // Getters y Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password; // Método para obtener la contraseña
    }

    public void setPassword(String password) {
        this.password = password; // Método para establecer la contraseña
    }

    public long getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(long lastSeen) {
        this.lastSeen = lastSeen;
    }

    // Actualiza el último tiempo de actividad
    public void updateLastSeen() {
        this.lastSeen = System.currentTimeMillis();
    }
}

