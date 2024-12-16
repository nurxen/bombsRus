/*package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class ClaseJava {

    @Autowired
    private UserService userService;

    @Autowired
    private RankingService rankingService;

    @Autowired
    private ConnectedUserService connectedUserService;

    public static void main(String[] args) {
        SpringApplication.run(ClaseJava.class, args);
    }

    // Crear usuario
    @PostMapping("/usuario")
    public String createUser(@RequestParam String usuario, @RequestParam String contrasena) {
        return userService.createUser(usuario, contrasena);
    }

    // Eliminar usuario
    @DeleteMapping("/usuario")
    public String deleteUser(@RequestParam String usuario) {
        return userService.deleteUser(usuario);
    }

    // Actualizar la actividad de un usuario
    @PutMapping("/update-activity")
    public ResponseEntity<String> updateUserActivity(@RequestParam String username) {
        userService.updateUserActivity(username);
        return ResponseEntity.ok("Usuario actualizado correctamente.");
    }

    // Obtener ranking de un usuario
    @GetMapping("/rankings")
    public String getRankings(@RequestParam String usuario) {
        return rankingService.getVictories(usuario);
    }

    // Actualizar ranking de un usuario
    @PostMapping("/rankings")
    public String updateRanking(@RequestParam String usuario) {
        return rankingService.updateRanking(usuario);
    }

    // Obtener usuarios conectados
    @GetMapping("/connected-users")
    public ResponseEntity<List<String>> getConnectedUsers() {
        List<String> connectedUsers = connectedUserService.getConnectedUsers(userService.getAllUsers());
        return ResponseEntity.ok(connectedUsers);
    }

    // POST: Cargar usuario y contraseña
    @PostMapping("/loadusuario")
    public ResponseEntity<String> cargarUsuario(@RequestBody UsuarioLoginRequest loginRequest) throws IOException {
        String usuario = loginRequest.getUsuario();
        String contrasena = loginRequest.getContrasena();

        if (usuario == null || contrasena == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Verificar si el usuario y la contraseña son correctos
        if (userService.authenticateUser(usuario, contrasena)) {
            return new ResponseEntity<>(usuario, HttpStatus.OK); // Si es correcto, devolvemos el usuario
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Si no, devolvemos 404
        }
    }
}*/