package com.example.demo;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.ConcurrentWebSocketSessionDecorator;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebsocketEchoHandler extends TextWebSocketHandler {
	
	@Autowired // Habilita la inyeccion de dependencias en clases de java
	private UserService userService;
	private int count = 0; // Contador de sesiones activas
	
	//tiempo maximo de una sesion en partida sin responder antes de cerrarla 
	private long maxTimeout = 1000 * 5;  // en milisegundos
	//tiempo max buscando partida
	private long maxTimeOnQueue = 1000 * 60;  // en milisegundos
	
	// Mapa que asocia IDs de sesiones con las sesiones de WebSocket correspondientes.
	private ConcurrentHashMap<String, WebSocketSession> sessionMap; 

	// Mapa que asocia IDs de sesiones con los usuarios correspondientes.
	private ConcurrentHashMap<String, User> userMap; 

	// Mapa que asocia IDs de usuarios emparejados entre sí (clave: ID de un usuario, valor: ID del usuario emparejado).
	private ConcurrentHashMap<String, String> pairedUsersMap; 

	// Cola de IDs de sesiones de usuarios que están esperando para jugar.
	private ConcurrentLinkedQueue<String> waitingQueue; 

	
	// para modificar los JSON
	private ObjectMapper objectMapper;
	
	public WebsocketEchoHandler() //inicializar las estructuras
	{
		sessionMap = new ConcurrentHashMap<String, WebSocketSession>();
		userMap = new ConcurrentHashMap<String, User>();
		pairedUsersMap = new ConcurrentHashMap<String, String>();
		waitingQueue = new ConcurrentLinkedQueue<String>();		
		objectMapper = new ObjectMapper();
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		
		// Comprobamos si el id de la sesion esta en el mapa, si no lo está la inicializamos
		if(!sessionMap.containsKey(session.getId()))
		{
			String newSession = startNewSession(session, message.getPayload());
			sendMessage(session, newSession);
			System.out.println("Mensaje enviado: " + newSession);
			return;
		}
		
		// comprobamos si el contenido del mensaje es para el servidos 
		if(message.getPayload().startsWith("!")) // los mensajes para el servidor empiezan con ! 
		{
			readServerMessage(session, message.getPayload());
			return;
		}
		
		// Si el mensaje es para el jugador contrario.
		ObjectNode json = objectMapper.createObjectNode();
		
		// Comprobamos si e jugador está en partida. Si no esta no se puede comunicar
		if(!(Boolean) session.getAttributes().get("isOnMatch"))
		{
			json.put("error", "Mensaje enviado a un oponente sin estar en partida.");
			json.put("onQueue", true);
			sendMessage(session, JSONToString(json));
			return;
		}
		
		// Obtenemos al segundo jugador emparejado
		String otherId = pairedUsersMap.get(session.getId());
		
		// Si se desconecta la otra sesion
		if(otherId == null) 
		{
			return;
		}
		
		// Enviamos un mensaje al otro jugador emparejado
		try
		{
			JsonNode jsonNode = objectMapper.readTree(message.getPayload());
			json = jsonNode.deepCopy();
		}
		catch (Exception e)
		{
			System.out.println("Error leyendo el JSON: " + e.getMessage());
			return;
		}
		
		// Cogemos al jugador emparejado
		WebSocketSession otherSession = sessionMap.get(otherId);
		json.put("onMatch", true);
		json.put("fromPlayer", true);
		if(otherSession.isOpen())
		{
			//otherSession.sendMessage(new TextMessage(JSONToString(json)));
			sendMessage(otherSession, JSONToString(json));
			session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		}
	}
	
	// Inicia una sesion
	private String startNewSession(WebSocketSession session, String message)
	{
		// Creamos un JSON con el inicio de sesion
		ObjectNode json = objectMapper.createObjectNode();
		json.put("onStart", true);
		
		// Comprobamos que el mensaje es para el servidor (tiene que empezar por !)
		if(!message.startsWith("!"))
		{
			json.put("error", "Formato inválido en el mensaje.");
			json.put("invalidFormat", true);
			return JSONToString(json);
		}
		
		// Mandamos el nombre de usuario con un JSON
		User newUser = User.fromJSON(message.substring(1));
		if(newUser == null)
		{
			json.put("error", "Usuario inválido en el mensaje.");
			json.put("invalidUser", true);
			return JSONToString(json); 
		}
		
		//se comprueba que el usuario este en el mapa de la api rest
		User actualUser = userService.getUser(newUser.getUsername());
		if(actualUser == null || !actualUser.getLogged())
		{
			json.put("error", "Usuario inválido.");
			json.put("invalidUser", true);
			return JSONToString(json);
		}
		
		// Comprobamos que si esta el usuario pero en otra sesion
		if(userMap.contains(actualUser))
		{
			json.put("error", "Usuario en otra sesión.");
			json.put("userInSession", true);
			return JSONToString(json);
		}
		
		// Anadimos los IDs de sesion y los usuarios a los mapas
		sessionMap.put(session.getId(), session);
		userMap.put(session.getId(), actualUser);
		
		// Inicializamos los atributos
		session.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		session.getAttributes().put("startQueueTime", System.currentTimeMillis());
		session.getAttributes().put("isOnMatch", false);
		
		// añadimos la sesion a la cola de emparejamiento
		waitingQueue.add(session.getId());
		json.put("info", "Sesión de emparejamiento iniciada para " + actualUser.getUsername() + ".");
		
		return JSONToString(json);
	}
	
	// Envia un mensaje
	private void sendMessage(WebSocketSession session, String message)
	{
		if(!session.isOpen())
		{
			System.out.println("Error al enviar mensaje a sesion cerrada.");
			return;
		}
		
		try
        {
        	ConcurrentWebSocketSessionDecorator concurrentSession = new ConcurrentWebSocketSessionDecorator(session, 500, 1000);
            concurrentSession.sendMessage(new TextMessage(message));
        }
        catch (Exception e)
        {
            System.out.println("Error mandando mensaje: " + e.getMessage());
        }
	}
	
	// Lectura de mensaje en el servidor. Si el mesaje es de GameOver cerramos sesion automaticamente
	private void readServerMessage(WebSocketSession session, String message)
	{
		JsonNode json = null;
		try
		{
			json = objectMapper.readTree(message.substring(1));
		}
		catch (Exception e)
		{
			System.out.println("Error leer JSON de mensaje al servidor: " + e.getMessage());
			return;
		}
		
		System.out.println("mensaje al server");
		JsonNode n = json.get("gameOver");
		
		Boolean gameOver = n != null && n.asBoolean();
		if(gameOver)
		{
			System.out.println("gameOver de jugador");
			session.getAttributes().put("gameOver", true);
			
			String otherId = pairedUsersMap.get((session.getId()));
			if(otherId == null) return;
			WebSocketSession otherSession = sessionMap.get(otherId);
			if(otherSession == null) return;
			
			Object go = otherSession.getAttributes().get("gameOver");
			
			if(go != null && (Boolean) go)
			{
				System.out.println("cerrando sesion por game over");
				closeSession(session);
			}
		}
	}
	
	// pasamos JSON a String
	private String JSONToString(ObjectNode json)
	{
		try
		{
			return objectMapper.writeValueAsString(json);
		}
		catch (Exception e)
		{
			System.out.println("Error al pasar de JSON a String: " + e.getMessage());
			return null;
		}
	}
	
	// llamamos a la funcion en el main 
	public void updateSessions()
	{
		System.out.println("UPDATESESIONES");
		doMatchmaking();
		checkSessions();
	}
	
	// Sistema de emparejado
	private void doMatchmaking()
	{
		// Comprobamos que la lista tiene mas de 2 usuarios
		if(waitingQueue.size() < 2) return;
		
		//Emparejamos a los 2 primeros usuarios de la cola y los sacamos
		String id1 = waitingQueue.poll(), id2 = waitingQueue.poll();
		
		// Los añadimos al mapa de usuarios emparejados
		pairedUsersMap.put(id1, id2);
		pairedUsersMap.put(id2, id1);
		
		// Aadimos los IDs de los jugadores a la sesion de juego
		WebSocketSession s1 = sessionMap.get(id1), s2 = sessionMap.get(id2);
		
		// Actualizamos los atributos
		s1.getAttributes().put("isOnMatch", true);
		s1.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		s2.getAttributes().put("isOnMatch", true);
		s2.getAttributes().put("lastMessageTime", System.currentTimeMillis());
		
		// Creamos mensajes en JSON para cada usuario con la info del otro. Tambien mandamos el jugador 1
		String[] jsons = getMatchStartJSONs(id1, id2); 
		
		try
		{	// Enviamos los mensajes
			sendMessage(s1, jsons[0]);
			sendMessage(s2, jsons[1]);
		}
		catch(Exception e)
		{
			System.out.println("Error al enviar mensajes de inicio de partida: " + e.getMessage());
		}
		
	}
	
	// Devolvemos mensajes en JSON para cada usuario con la info del otro. Tambien mandamos el jugador 1
	private String[] getMatchStartJSONs(String id1, String id2)
	{
		// Creamos un JSON para cada jugador
		ObjectNode jsonU1 = objectMapper.createObjectNode(), jsonU2 = objectMapper.createObjectNode();
		
		// Obtrenemos sus IDs
		User user1 = userMap.get(id1), user2 = userMap.get(id2);
		
		// Inicializamos sus atributos
		jsonU1.put("onQueue", true);
		jsonU2.put("onQueue", true);
		
		jsonU1.put("matchStart", true);
		jsonU2.put("matchStart", true);
		
		jsonU1.put("username", user1.getUsername());
		jsonU2.put("username", user2.getUsername());

		jsonU1.put("otherUsername", user2.getUsername());
		jsonU2.put("otherUsername", user1.getUsername());
		
		// Elegimos el jugador 1 de manera aleatoria 
		boolean isPlayer1 = new Random().nextBoolean();
		jsonU1.put("isPlayer1", isPlayer1);
		jsonU2.put("isPlayer1", !isPlayer1);
				
		// Metemos en un array de strings los usuarios
		String[] jsons = {JSONToString(jsonU1), JSONToString(jsonU2)};
		return jsons;
	}	
	
	// Comprobamos si la sesión sigue activa 
	private void checkSessions()
	{
		// Escrtibimos todo a null
		System.out.println(" /checkeo de sesiones/ " + count ++);
		ObjectNode json = objectMapper.createObjectNode();
		WebSocketSession session = null;
		Long lastMessageTime = null, startQueueTime = null;
		Map<String, Object> attributes = null;
		Long currentTime = System.currentTimeMillis();
		
		//se iteran todas las sesiones del mapa
		for	(String id : sessionMap.keySet())
		{
			session = sessionMap.get(id);
			
			if(session == null) continue;
			
			attributes = session.getAttributes();
			lastMessageTime = (Long) attributes.get("lastMessageTime"); 
			startQueueTime = (Long) attributes.get("startQueueTime");
			Boolean isOnMatch = (Boolean) attributes.get("isOnMatch");
			
			CloseStatus status = null;
			
			if(lastMessageTime == null || startQueueTime == null || isOnMatch == null) continue;
			
			//si esta en partida y lleva un tiempo sin enviar nada, se cierra
			if(isOnMatch && currentTime - lastMessageTime >= maxTimeout)
			{
			}//si lleva demasiado tiempo en la cola sin encontrar partida se cierra
			else if(!isOnMatch && currentTime - startQueueTime >= maxTimeOnQueue)
			{
			}
			else continue; // Si no se cierra la conexion continuamos a la siguiente iteracion
			System.out.println("Cerrando sesion de " + userMap.get(id).getUsername());
			closeSession(session);
		}
	}
	
	// Cerramos la sesion
	private void closeSession(WebSocketSession session)
	{
		closeSession(session, CloseStatus.NORMAL);
	}
	
	// Cerramos sesion
	private void closeSession(WebSocketSession session, CloseStatus status)
	{
		try
		{
			// Obtenemos atributos
			String id = session.getId();
			String username = userMap.get(id).getUsername();
			Boolean onMatch = (Boolean) session.getAttributes().get("isOnMatch");
			session.close(status); //Cerramos la sesion
			
			// Borramos la sesion de los mapas
			sessionMap.remove(id);
			userMap.remove(id);
			System.out.println("Sesion cerrada para" + username);
			
			// Eliminamos d la cola si esta
			if(onMatch == null || !onMatch) waitingQueue.remove(session.getId()); 
			else
			{	// Si estaba en partida quitamos el emparejamiento con el otro jugador
				
				String otherId = pairedUsersMap.get(id);
				pairedUsersMap.remove(id);
				if(otherId != null)
				{
					pairedUsersMap.remove(otherId);
					if(sessionMap.containsKey(otherId) || sessionMap.get(otherId) != null) 
						closeSession(sessionMap.get(otherId)/*, new CloseStatus(7777, "opponentDisconnected")*/);	
				}
				
						
			}

		}
		catch(Exception e)
		{
			System.out.println("Error cerrando sesión: " + e.getMessage());
		}
		
	}
		
}
