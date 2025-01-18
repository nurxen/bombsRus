package com.example.demo;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@EnableWebSocket
@SpringBootApplication
public class EchoApplication implements WebSocketConfigurer {

	
    @Override
    // Asignamos el handler al registro
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
    	registry.addHandler(echoHandler(), "/match").setAllowedOrigins("*");
    }

    
    @Bean
    // Creamos el handler y los usamos
    public WebsocketEchoHandler echoHandler() {
    	return new WebsocketEchoHandler();
    }
    
  	@Bean
  	// Llamamos a updateSessions() del handler, una vez cada segundo
  	public ScheduledExecutorService sessionTimeoutChecker()
  	{
  		ScheduledExecutorService executorService = Executors.newSingleThreadScheduledExecutor();
  		
  		executorService.scheduleAtFixedRate(() -> {
  		    try {
  		    	echoHandler().updateSessions();
  		    } catch (Exception e) {
  		        System.out.println("Error del sheduled executor: " + e.getMessage());
  		        e.printStackTrace();
  		    }
  		}, 0, 1, TimeUnit.SECONDS);
  		
      	return executorService;
    }
    
    public static void main(String[] args) {
        SpringApplication.run(EchoApplication.class, args);
    }
}
