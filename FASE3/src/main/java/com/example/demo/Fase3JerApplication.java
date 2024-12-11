package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class Fase3JerApplication {

    // Simulación de una base de datos en memoria
    private Map<String, String> users = new HashMap<>();
    private String opcionesVolumen = "50"; // Ajustes iniciales del volumen

    public static void main(String[] args) {
        SpringApplication.run(Fase3JerApplication.class, args);
    }

    // POST: Crear usuario y contraseña
    @PostMapping("/usuario")
    public String crearUsuario(@RequestParam String usuario, @RequestParam String contrasena) {
        if (users.containsKey(usuario)) {
            return "El usuario ya existe.";
        }
        users.put(usuario, contrasena);

        // Guardar en archivo .txt
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("usuarios.txt", true))) {
            writer.write(usuario + ":" + contrasena);
            writer.newLine();
        } catch (IOException e) {
            e.printStackTrace();
            return "Error al guardar el usuario.";
        }
        return "Usuario creado correctamente.";
    }

    // GET: Obtener usuarios desde el archivo
    @GetMapping("/usuario")
    public Map<String, String> obtenerUsuarios() {
        try {
            return Files.lines(Paths.get("usuarios.txt"))
                .map(line -> line.split(":"))
                .collect(Collectors.toMap(parts -> parts[0], parts -> parts[1]));
        } catch (IOException e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    // DELETE: Borrar usuario
    @DeleteMapping("/usuario")
    public String borrarUsuario(@RequestParam String usuario) {
        if (users.remove(usuario) != null) {
            return "Usuario eliminado correctamente.";
        }
        return "El usuario no existe.";
    }

    // PUT: Cambiar la contraseña
    @PutMapping("/usuario")
    public String cambiarContrasena(@RequestParam String usuario, @RequestParam String nuevaContrasena) {
        if (users.containsKey(usuario)) {
            users.put(usuario, nuevaContrasena);
            return "Contraseña actualizada correctamente.";
        }
        return "El usuario no existe.";
    }

    // GET: Obtener ajustes modificados (por ejemplo, volumen)
    @GetMapping("/opciones/volumen")
    public String obtenerVolumen() {
        return "El volumen actual es: " + opcionesVolumen;
    }

    // PUT: Modificar ajustes del volumen
    @PutMapping("/opciones/volumen")
    public String modificarVolumen(@RequestParam String nuevoVolumen) {
        this.opcionesVolumen = nuevoVolumen;
        return "Volumen actualizado a: " + nuevoVolumen;
    }
}
