package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class Fase3JerApplication {

    // Simulación de una base de datos en memoria
    private Map<String, String> users = new HashMap<>();
    private String opcionesVolumen = "50"; // Ajustes iniciales del volumen

    // Archivos de usuario y rankings
    private final String usuariosFile = "usuarios.txt";
    private final String rankingsFile = "rankings.txt";

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
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(usuariosFile, true))) {
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
            return Files.lines(Paths.get(usuariosFile))
                .map(line -> line.split(":"))
                .collect(Collectors.toMap(parts -> parts[0], parts -> parts[1]));
        } catch (IOException e) {
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    // DELETE: Borrar usuario
    @DeleteMapping("/usuario")
    public String borrarUsuario(@RequestBody String usuario) {
        // Leer todo el contenido del archivo
        List<String> lines;
        try {
            lines = Files.readAllLines(Paths.get(usuariosFile));
        } catch (IOException e) {
            e.printStackTrace();
            return "Error al leer el archivo.";
        }

        // Filtrar las líneas para eliminar al usuario
        List<String> updatedLines = lines.stream()
            .filter(line -> !line.startsWith(usuario + ":"))
            .collect(Collectors.toList());

        // Si el archivo ha cambiado, lo reescribimos
        if (lines.size() != updatedLines.size()) {
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(usuariosFile))) {
                for (String line : updatedLines) {
                    writer.write(line);
                    writer.newLine();
                }
                return "Usuario eliminado correctamente.";
            } catch (IOException e) {
                e.printStackTrace();
                return "Error al escribir en el archivo.";
            }
        }
        return "El usuario no existe.";
    }

    // PUT: Cambiar la contraseña
    @PutMapping("/usuario")
    public String cambiarContrasena(@RequestBody String usuario, @RequestBody String nuevaContrasena) {
        // Leer el archivo
        List<String> lines;
        try {
            lines = Files.readAllLines(Paths.get(usuariosFile));
        } catch (IOException e) {
            e.printStackTrace();
            return "Error al leer el archivo.";
        }

        // Buscar el usuario y actualizar la contraseña
        boolean userFound = false;
        List<String> updatedLines = new ArrayList<>();
        for (String line : lines) {
            String[] parts = line.split(":");
            if (parts[0].equals(usuario)) {
                updatedLines.add(usuario + ":" + nuevaContrasena); // Cambiar la contraseña
                userFound = true;
            } else {
                updatedLines.add(line); // Mantener las demás líneas igual
            }
        }

        if (userFound) {
            // Reescribir el archivo con las líneas actualizadas
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(usuariosFile))) {
                for (String line : updatedLines) {
                    writer.write(line);
                    writer.newLine();
                }
                return "Contraseña actualizada correctamente.";
            } catch (IOException e) {
                e.printStackTrace();
                return "Error al escribir en el archivo.";
            }
        }

        return "El usuario no existe.";
    }

    @GetMapping("/rankings")
    public String obtenerVictorias(@RequestParam String usuario) {
        try {
            // Leer todas las líneas del archivo
            List<String> lines = Files.readAllLines(Paths.get(rankingsFile));

            for (String line : lines) {
                String[] parts = line.split(":");
                if (parts.length == 2 && parts[0].equals(usuario)) {
                    return usuario + " tiene " + parts[1] + " victorias.";
                }
            }

            return "El usuario '" + usuario + "' no tiene victorias registradas.";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error al obtener las victorias del usuario.";
        }
    }

    // POST: Escribir rankings de jugadores
    @PostMapping("/rankings")
    public String actualizarRanking(@RequestParam String usuario) {
        try {
            // Leer todas las líneas del archivo
            List<String> lines = Files.readAllLines(Paths.get(rankingsFile));
            boolean usuarioEncontrado = false;

            // Crear un escritor temporal para guardar los nuevos datos
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(rankingsFile))) {
                for (String line : lines) {
                    String[] parts = line.split(":");
                    if (parts.length == 2 && parts[0].equals(usuario)) {
                        // Si el usuario ya existe, incrementa su puntaje
                        int victorias = Integer.parseInt(parts[1]) + 1;
                        writer.write(usuario + ":" + victorias);
                        writer.newLine();
                        usuarioEncontrado = true;
                    } else {
                        // Reescribe las líneas existentes sin cambios
                        writer.write(line);
                        writer.newLine();
                    }
                }

                // Si el usuario no fue encontrado, agregarlo con 1 victoria
                if (!usuarioEncontrado) {
                    writer.write(usuario + ":1");
                    writer.newLine();
                }
            }

            return "Ranking actualizado correctamente.";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error al actualizar el ranking.";
        }
    }


}
