package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
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

    // Simulación de una base de datos en memoria
    private Map<String, String> users = new HashMap<>();
    private String opcionesVolumen = "50"; // Ajustes iniciales del volumen

    // Archivos de usuario y rankings
    private final String usuariosFile = "usuarios.txt";
    private final String rankingsFile = "rankings.txt";

    public static void main(String[] args) {
        SpringApplication.run(Fase3JerApplication.class, args);
    }

    
    
    @GetMapping("/getIp")
    @ResponseBody
    public String getServerIp() {
        try {
            // Obtiene la dirección IP del servidor
            InetAddress inetAddress = InetAddress.getLocalHost();
            String serverIp = inetAddress.getHostAddress();
            System.out.println(serverIp);
            return serverIp;
        } catch (UnknownHostException e) {
            e.printStackTrace();
            return "No se pudo obtener la dirección IP del servidor.";
        }
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
    
    // POST: Cargar usuario y contraseña
    @PostMapping("/loadusuario")
    public ResponseEntity<String> cargarUsuario(@RequestBody String usuario, @RequestBody String contrasena) throws IOException {
    	
    	List<String> lines = Files.readAllLines(Paths.get(usuariosFile));
    	System.out.println("u: " + usuario + " c: " + contrasena);
    	
    	if (usuario == null || contrasena == null) {
    		
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	}
    	
    	for(String line : lines){
    		String[] parts = line.split(":");
    		if((parts.length == 2 && parts[0].equals(usuario))&&(parts.length == 2 && parts[1].equals(contrasena))){
    			return new ResponseEntity<>(usuario, HttpStatus.OK);
    		}
    	}
    	return new ResponseEntity<>( HttpStatus.NOT_FOUND);
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
    public String obtenerVictorias(@RequestParam String usuario) {
        try {
            // Leer todas las líneas del archivo
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


}