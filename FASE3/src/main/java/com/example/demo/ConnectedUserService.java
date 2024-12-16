package com.example.demo;

import com.example.demo.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ConnectedUserService {

    private final long thresholdMillis = 30000; // 30 segundos

    // Obtener lista de usuarios conectados
    public List<String> getConnectedUsers(Map<String, User> users) {
        long currentTime = System.currentTimeMillis();
        List<String> connectedUsers = new ArrayList<>();

        users.forEach((username, user) -> {
            if (user.getLastSeen() > (currentTime - thresholdMillis)) {
                connectedUsers.add(user.getUsername());
            }
        });

        return connectedUsers;
    }
}
