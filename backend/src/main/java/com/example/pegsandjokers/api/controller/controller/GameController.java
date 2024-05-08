package com.example.pegsandjokers.api.controller.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.pegsandjokers.api.controller.model.Board;
import com.example.pegsandjokers.api.controller.model.Card;
import com.example.pegsandjokers.api.controller.model.Game;
import com.example.pegsandjokers.api.controller.model.Turn;
import com.example.pegsandjokers.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class GameController {

    private GameService gameService;

    @Autowired
    public GameController(GameService gameService){
        this.gameService = gameService;
    }

    @GetMapping("/board")
    public Game getGame(@RequestParam String roomName){
        Optional<Game> game = gameService.getGame(roomName);
        return (Game) game.orElse(null);
    }

    @PostMapping("/sendPieceToHeaven")
    public ResponseEntity<?> sendPieceToHeaven(@RequestParam int playerNum){
        boolean success = gameService.sendPieceToHeaven(playerNum);
        if (success){
            return ResponseEntity.ok().body("Sent Piece to Heaven!");
        }
        return ResponseEntity.badRequest().body("Failed to Send Piece To Heaven!");
    }

    @PostMapping("/game")
    public ResponseEntity<?> makeNewGame(@RequestParam String roomName){
        gameService.createGame(roomName);
        return ResponseEntity.ok().body("New game created! Room Name: " + roomName);
    }

    @PostMapping("/play/turn")
    public ResponseEntity<?> playTurn(@RequestBody Turn turn) {
        boolean success = gameService.takeTurn(turn);
        if (success) {
            if (gameService.isWinner(turn.getRoomName())){
                return ResponseEntity.ok().body("Game Over!");
            }
            boolean cardUpdated = gameService.updateCard(turn);
            if (cardUpdated){
                gameService.incrementPlayerTurn(turn.getRoomName());
                return ResponseEntity.ok().body("Successful Move!");
            }
            return ResponseEntity.badRequest().body("Failed to Update Hand!");
        } else {
            return ResponseEntity.badRequest().body("Invalid move!");
        }
    }
}
