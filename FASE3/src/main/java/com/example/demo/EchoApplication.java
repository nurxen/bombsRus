package com.example.demo;

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
    public void registerWebSocketHandlers(
    WebSocketHandlerRegistry registry) {
    registry.addHandler(echoHandler(), "/echo")
    .setAllowedOrigins("*");
    }

    
    @Bean
    public WebsocketEchoHandler echoHandler() {
    return new WebsocketEchoHandler();
    }
    
    public static void main(String[] args) {
        SpringApplication.run(EchoApplication.class, args);
    }
}
