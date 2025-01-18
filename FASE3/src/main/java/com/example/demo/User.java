package com.example.demo;
import com.fasterxml.jackson.databind.ObjectMapper;

public class User {
	private String username;
    private String password; // Nuevo campo para la contraseña
    private boolean logged;
    private long lastSeen;

    // Constructor con la contraseña
    public User(String username, String password, long lastSeen) {
        this.username = username;
        this.password = password;
        this.lastSeen = lastSeen;
        this.logged = true;
    }
    
 // Constructor con la contraseña
    public User() {
        this.username = null;
        this.password = null;
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
    
    public boolean getLogged() {
    	return logged;
    }
    
    public void setLogged(boolean logged) {
    	this.logged = logged;
    }
    
    /*public boolean setLogged(boolean l)
	{
		if(l == logged) return false;
		logged = l;
		return true;
	}*/

    // Actualiza el último tiempo de actividad
    public void updateLastSeen() {
        this.lastSeen = System.currentTimeMillis();
    }
    
    public String toJSON()
	{
        ObjectMapper objectMapper = new ObjectMapper();
        try
        {
			String json = objectMapper.writeValueAsString(this);
			return json;
		}
        catch (Exception e)
        {
            System.out.println("Error al serializar: " + e.getMessage());
			return null;
		}
	}
	
	public static User fromJSON(String json)
	{
		try
		{
            ObjectMapper objectMapper = new ObjectMapper();
            User user = objectMapper.readValue(json, User.class);
            return user;
            
        }
		catch (Exception e)
		{
            System.out.println("Error al deserializar: " + e.getMessage());
            return null;
        }
	}
}

