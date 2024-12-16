package com.example.demo;

import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.util.*;

@Service
public class RankingService {

    private final String rankingsFile = "rankings.txt";

    // Obtener las victorias de un usuario
    public String getVictories(String username) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(rankingsFile));
            for (String line : lines) {
                String[] parts = line.split(":");
                if (parts.length == 2 && parts[0].equals(username)) {
                    return username + " HAS " + parts[1] + " VICTORIES.";
                }
            }
            return "THE USER '" + username + "' HAS NO RECORDED VICTORIES.";
        } catch (IOException e) {
            e.printStackTrace();
            return "ERROR GETTING USER WINS.";
        }
    }

    // Actualizar las victorias de un usuario
    public String updateRanking(String username) {
        try {
            List<String> lines = Files.readAllLines(Paths.get(rankingsFile));
            boolean userFound = false;

            try (BufferedWriter writer = new BufferedWriter(new FileWriter(rankingsFile))) {
                for (String line : lines) {
                    String[] parts = line.split(":");
                    if (parts.length == 2 && parts[0].equals(username)) {
                        int victories = Integer.parseInt(parts[1]) + 1;
                        writer.write(username + ":" + victories);
                        writer.newLine();
                        userFound = true;
                    } else {
                        writer.write(line);
                        writer.newLine();
                    }
                }

                if (!userFound) {
                    writer.write(username + ":1");
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
