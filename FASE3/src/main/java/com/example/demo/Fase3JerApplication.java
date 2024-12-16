package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class Fase3JerApplication {

    private Map<String, String> users = new HashMap<>();
    private String opcionesVolumen = "50";
    private final String usuariosFile = "usuarios.txt";
    private final String rankingsFile = "rankings.txt";
    private List<Map<String, String>> chatMessages = new ArrayList<>();

    public static void main(String[] args) {
        SpringApplication.run(Fase3JerApplication.class, args);
    }

    @GetMapping("/getIp")
    public String getServerIp() {
        try {
            InetAddress inetAddress = InetAddress.getLocalHost();
            return inetAddress.getHostAddress();
        } catch (UnknownHostException e) {
            e.printStackTrace();
            return "No se pudo obtener la dirección IP del servidor.";
        }
    }

    @PostMapping("/usuario")
    public String crearUsuario(@RequestParam String usuario, @RequestParam String contrasena) {
        if (users.containsKey(usuario)) {
            return "THE USER ALREADY EXISTS.";
        }
        users.put(usuario, contrasena);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(usuariosFile, true))) {
            writer.write(usuario + ":" + contrasena);
            writer.newLine();
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR SAVING USER.";
        }
        return "USER CREATED SUCCESSFULLY.";
    }

    @PostMapping("/loadusuario")
    public ResponseEntity<String> cargarUsuario(@RequestBody String usuario, @RequestBody String contrasena) throws IOException {
        List<String> lines = Files.readAllLines(Paths.get(usuariosFile));
        for (String line : lines) {
            String[] parts = line.split(":");
            if (parts.length == 2 && parts[0].equals(usuario) && parts[1].equals(contrasena)) {
                return ResponseEntity.ok(usuario);
            }
        }
        return ResponseEntity.status(404).build();
    }

    @DeleteMapping("/usuario")
    public String borrarUsuario(@RequestParam String usuario) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(usuariosFile));
            List<String> updatedLines = lines.stream()
                    .filter(line -> !line.startsWith(usuario + ":"))
                    .collect(Collectors.toList());
            Files.write(Paths.get(usuariosFile), updatedLines);
            return "USER DELETED SUCCESSFULLY.";
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR DELETING USER.";
        }
    }

    @PutMapping("/usuario")
    public String cambiarContrasena(@RequestParam String usuario, @RequestParam String nuevaContrasena) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(usuariosFile));
            boolean userFound = false;
            List<String> updatedLines = new ArrayList<>();
            for (String line : lines) {
                String[] parts = line.split(":");
                if (parts[0].equals(usuario)) {
                    updatedLines.add(usuario + ":" + nuevaContrasena);
                    userFound = true;
                } else {
                    updatedLines.add(line);
                }
            }
            if (userFound) {
                Files.write(Paths.get(usuariosFile), updatedLines);
                return "PASSWORD UPDATED SUCCESSFULLY.";
            }
            return "USER DOESN'T EXIST.";
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR UPDATING PASSWORD.";
        }
    }

    @GetMapping("/rankings")
    public String obtenerVictorias(@RequestParam String usuario) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(rankingsFile));
            for (String line : lines) {
                String[] parts = line.split(":");
                if (parts.length == 2 && parts[0].equals(usuario)) {
                    return usuario + " HAS " + parts[1] + " VICTORIES.";
                }
            }
            return "THE USER '" + usuario + "' HAS NO RECORDED VICTORIES.";
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR GETTING USER WINS.";
        }
    }

    @PostMapping("/rankings")
    public String actualizarRanking(@RequestParam String usuario) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(rankingsFile));
            boolean usuarioEncontrado = false;
            try (BufferedWriter writer = new BufferedWriter(new FileWriter(rankingsFile))) {
                for (String line : lines) {
                    String[] parts = line.split(":");
                    if (parts.length == 2 && parts[0].equals(usuario)) {
                        int victorias = Integer.parseInt(parts[1]) + 1;
                        writer.write(usuario + ":" + victorias);
                        writer.newLine();
                        usuarioEncontrado = true;
                    } else {
                        writer.write(line);
                        writer.newLine();
                    }
                }
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
}
