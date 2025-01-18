package com.example.demo;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class UserService {
	private HashMap<String, User> users = null;
	private List<User> loggedUsers = new ArrayList<>();
	
	private final String filePath = System.getProperty("user.dir") + "\\usuarios.txt";
	
	public User signUp(User user)
	{	
		if(users == null) loadUsers();
		if(user == null) return null;
		
		if(users.containsKey(user.getUsername())) return null;
		
		user.setLogged(true);
		users.put(user.getUsername(), user);
		printUsers();
		saveUsers();
		return user;
	}
	
	public User getUser(String username)
	{
		if(users == null) loadUsers();
		if(users.containsKey(username)) return users.get(username);	
		return null;
	}
	
	
	public User logIn(User user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;
		
		User existentUser = getUser(user.getUsername());
		
		if(existentUser == null || !existentUser.getPassword().equals(user.getPassword()))
			return null;
		
		existentUser.setLogged(true);
		printUsers();
		loggedUsers.add(existentUser);
		return existentUser;
	}
	
	public User logOut(User user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;
		
		User existentUser = getUser(user.getUsername());
		
		if(existentUser == null) return null;
		
		existentUser.setLogged(false);
		printUsers();
		loggedUsers.remove(existentUser);
		return existentUser;
	}
	
	public User changePassword(User user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;

		User existentUser = getUser(user.getUsername());
		
		if(existentUser == null || !existentUser.getLogged()) return null;
		
		existentUser.setPassword(user.getPassword());
		printUsers();
		saveUsers();
		return existentUser;
	}
	
	public User deleteUser(User user)
	{
		if(users == null) loadUsers();
		if(user == null) return null;

		User existentUser = getUser(user.getUsername());
		
		if(existentUser == null || !existentUser.getLogged()) return null;
		
		users.remove(existentUser.getUsername());
		printUsers();
		loggedUsers.remove(existentUser);
		saveUsers();
		return existentUser;

	}
	
	public final List<User> getLoggedUsers() { return loggedUsers; }
	
	private void printUsers()
	{
		if(users == null) loadUsers();
		
		System.out.println("\nUSERS:");
		for (String key: users.keySet()) {
		    User value = users.get(key);
		    System.out.println(key + " -> " + 
		    value.getPassword() + " -> logged: " + value.getLogged());
		}
	}
	
	
	private void saveUsers()
	{
	    ObjectMapper objectMapper = new ObjectMapper();

	    try
	    {
	        // Guardar el JSON en un archivo
	        File file = new File(filePath);
	        objectMapper.writeValue(file, users);
	        System.out.println("usuarios guardados en " + filePath);
	    }
	    catch (IOException e)
	    {
	    	System.out.println("Error al guardar fichero de usuarios: " + e.getMessage());
	    }
    }
	

	
	private void loadUsers()
	{
        ObjectMapper objectMapper = new ObjectMapper();

        // Cargar el JSON desde el archivo
        File file = new File(filePath);
        
        try
        {
        	 List<String> lines = Files.readAllLines(Paths.get(filePath));

    		 users = new HashMap<>();
        	 
        		 for (String line : lines) {
        			 String[] parts = line.split(":");//dividir el string en username y contraseña
        			 users.put(parts[0], new User(parts[0], parts[1]));
        		 }
        	 
        		
             
            System.out.println("Usuarios cargados desde " + filePath);
            //for(User user : users.values()) user.setLogged(false);
            printUsers();
        }
        catch (IOException e)
        {
        	System.out.println("Error al leer fichero de usuarios: " + e.getMessage());
            users =  new HashMap<>();
        }
    }
}
