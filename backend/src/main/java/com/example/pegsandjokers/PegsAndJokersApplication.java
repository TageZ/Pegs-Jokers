package com.example.pegsandjokers;

import com.corundumstudio.socketio.*;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootApplication
public class PegsAndJokersApplication {

    public static void main(String[] args) {
        SpringApplication.run(PegsAndJokersApplication.class, args);

        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(3306);
        config.setContext("/socket.io");
        config.setOrigin("*"); // Allow requests from all origins

        SocketConfig socketConfig = new SocketConfig();
        socketConfig.setReuseAddress(true);

        config.setSocketConfig(socketConfig);


        SocketIOServer server = new SocketIOServer(config);
        List<String> usernames = new ArrayList<>();


        // Add connect listener
        server.addConnectListener(new ConnectListener() {
            public void onConnect(SocketIOClient client) {
                System.out.println("Client connected: " + client.getRemoteAddress());
            }
        });

        server.addEventListener("updateBoard", String.class, new DataListener<String>() {
            public void onData(SocketIOClient client, String data, AckRequest ackRequest) throws Exception {
                System.out.println("Received board update: " + data);
                // Broadcast the updated board data only to clients in the same game room
                server.getRoomOperations(data.trim()).sendEvent("updateBoardResponse", data);
            }
        });

        server.addEventListener("winner", String.class, new DataListener<String>() {
            public void onData(SocketIOClient client, String data, AckRequest ackRequest) throws Exception {
                System.out.println("Winner found " + data);
                // Broadcast the updated board data only to clients in the same game room
                server.getRoomOperations(data.trim()).sendEvent("winnerResponse", data);
            }
        });

        server.addEventListener("join", String.class, new DataListener<String>() {
            public void onData(SocketIOClient client, String data, AckRequest ackRequest) throws Exception {
                String[] parts = data.split(",");
                String roomName = parts[0].trim();
                String username = parts[1].trim();

                if (!usernames.contains(username)) {
                    usernames.add(username);
                }

                client.set("username", username);
                client.joinRoom(roomName);
                System.out.println(username + " joined room " + roomName);

                // Broadcast updated user list to all clients in the room
                server.getRoomOperations(roomName).sendEvent("getUsers", usernames);
            }
        });

        server.addEventListener("updateCard", String.class, new DataListener<String>() {
            public void onData(SocketIOClient client, String data, AckRequest ackRequest) throws Exception {
                String[] parts = data.split(",");
                String roomName = parts[0].trim();
                String cardValue = parts[1].trim();

                // Broadcast updated user list to all clients in the room
                server.getRoomOperations(roomName).sendEvent("lastCard", cardValue);
            }
        });

        server.addEventListener("requestUserCount", String.class, new DataListener<String>() {
            public void onData(SocketIOClient client, String roomName, AckRequest ackRequest) throws Exception {
                int userCount = server.getRoomOperations(roomName).getClients().size();
                client.sendEvent("userCountResponse", userCount);
            }
        });

        server.addEventListener("leave", String.class, new DataListener<String>() {
            @Override
            public void onData(SocketIOClient socketIOClient, String roomName, AckRequest ackRequest) throws Exception {
                socketIOClient.leaveRoom(roomName);
            }
        });

        server.addEventListener("getUsers", String.class, new DataListener<String>() {
            @Override
            public void onData(SocketIOClient client, String roomName, AckRequest ackRequest) throws Exception {
                List<String> usernames = server.getRoomOperations(roomName).getClients().stream()
                        .map(c -> c.get("username").toString())
                        .collect(Collectors.toList());
                client.sendEvent("getUsers", usernames);
            }
        });

        server.start();
    }
}