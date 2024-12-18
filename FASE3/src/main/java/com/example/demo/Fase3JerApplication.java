package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class Fase3JerApplication {

    private List<Map<String, String>> chatMessages = new ArrayList<>();

    // Simulación de una base de datos en memoria
    private Map<String, String> users = new HashMap<>();

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
            return "THE USER ALREADY EXISTS.";
        }
        users.put(usuario, contrasena);

        // Guardar en archivo .txt
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(usuariosFile, true))) {
            writer.write(usuario + ":" + contrasena);
            writer.newLine();
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR SAVING USER.";
        }
        return "USER CREATED SUSCCESSFULLY.";
    }
    
    @GetMapping("/conexion")
    public ResponseEntity<String> conexion(){
    	return new ResponseEntity<>(HttpStatus.OK);
    }
    
    // POST: Cargar usuario y contraseña
    @PostMapping("/loadusuario")
    public ResponseEntity<String> cargarUsuario(@RequestBody User usuario) throws IOException {
        List<String> lines = Files.readAllLines(Paths.get(usuariosFile));
        System.out.println("u: " + usuario.getUsername() + " c: " + usuario.getPassword());

        if (usuario == null || usuario.getUsername() == null || usuario.getPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        for (String line : lines) {
            String[] parts = line.split(":");
            if (parts.length == 2 && parts[0].equals(usuario.getUsername()) && parts[1].equals(usuario.getPassword())) {
                return new ResponseEntity<>(usuario.getUsername(), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // DELETE: Borrar usuario
    @DeleteMapping("/usuario")
    public String borrarUsuario(@RequestParam String usuario) {
        // Leer todo el contenido del archivo
        List<String> lines;
        try {
            lines = Files.readAllLines(Paths.get(usuariosFile));
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR READING FILE.";
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
                return "USER DELETED SUCCESSFULLY.";
            } catch (IOException e) {
                e.printStackTrace();
                return "Error al escribir en el archivo.";
            }
        }
        return "USER DOESN´T EXIST.";
    }

    // PUT: Cambiar la contraseña
    @PutMapping("/usuario")
    public String cambiarContrasena(@RequestParam String usuario, @RequestParam String nuevaContrasena) {
        // Leer el archivo
        List<String> lines;
        try {
            lines = Files.readAllLines(Paths.get(usuariosFile));
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR READING FILE.";
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
                return "PASSWORD UPDATED SUCCESSFULLY.";
            } catch (IOException e) {
                e.printStackTrace();
                return "ERROR WRITING FILE.";
            }
        }

        return "USER DOESN´T EXIST.";
    }

    @GetMapping("/rankings")
    public String obtenerVictorias() {
        try {
            // Leer todas las líneas del archivo
            List<String> lines = Files.readAllLines(Paths.get(rankingsFile));
            StringBuilder response = new StringBuilder();

            // Recorrer todas las líneas y agregar la información de victorias
            for (String line : lines) {
                String[] parts = line.split(":");
                if (parts.length == 2) {
                    response.append(parts[0] + " has " + parts[1] + " victories.\n");
                }
            }

            // Si no hay información, devolver un mensaje adecuado
            if (response.length() == 0) {
                return "NO USER VICTORIES RECORDED.";
            }

            return response.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR GETTING USER WINS.";
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

            return "RANKING UPDATED SUCCESSFULLY.";
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR UPDATING RANKING.";
        }
    }
    
    @GetMapping("/chat")
    public List<Map<String, String>> obtenerMensajesDeChat() {
        return chatMessages; //Devuelve todos los mensajes almacenados en chatMessages
    }

    @PostMapping("/chat")
    public ResponseEntity<String> enviarMensajeAlChat(@RequestBody Map<String, String> message) {
        String username = message.get("username"); //pillamos el valor asiciado al usarname
        String chatMessage = message.get("message"); //pillamos valor asociado al mensaje
        if (username == null || chatMessage == null) { //chekeamos que ningun valor sea null
            return ResponseEntity.badRequest().body("Missing username or message.");
        }
        Map<String, String> newMessage = new HashMap<>();
        newMessage.put("username", username);
        newMessage.put("message", chatMessage);
        chatMessages.add(newMessage);
        return ResponseEntity.ok("Message sent.");
    }
    
 // Lista de usuarios conectados
    private List<String> usuariosConectados = new ArrayList<>();

    // Endpoint para agregar usuario a la lista de conectados
    @PostMapping("/usuarioConectado")
    public ResponseEntity<String> agregarUsuarioConectado(@RequestParam String usuario) {
        if (!usuariosConectados.contains(usuario)) {
            usuariosConectados.add(usuario);
            return ResponseEntity.ok("Usuario conectado.");
        }
        return ResponseEntity.badRequest().body("El usuario ya está conectado.");
    }

    // Endpoint para eliminar usuario de la lista de conectados
    @DeleteMapping("/usuarioConectado")
    public ResponseEntity<String> eliminarUsuarioConectado(@RequestParam String usuario) {
        if (usuariosConectados.contains(usuario)) {
            usuariosConectados.remove(usuario);
            return ResponseEntity.ok("Usuario desconectado.");
        }
        return ResponseEntity.badRequest().body("El usuario no está en la lista.");
    }

    // Endpoint para obtener la lista de usuarios conectados
    @GetMapping("/usuariosConectados")
    public List<String> obtenerUsuariosConectados() {
        return usuariosConectados;
    }


}