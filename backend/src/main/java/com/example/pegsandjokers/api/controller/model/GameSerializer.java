package com.example.pegsandjokers.api.controller.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class GameSerializer extends JsonSerializer<Game>{

        @Override
        public void serialize(Game game, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (game == null) {
            gen.writeNull();
        } else {
            gen.writeStartObject();
            gen.writeStringField("roomName", game.getRoomName());
            gen.writeNumberField("playerTurn", game.getPlayerTurn());
            gen.writeObjectField("loop", game.getBoard().getLoop());
            gen.writeObjectField("heavens", game.getBoard().getHeavens());
            gen.writeObjectField("starts", game.getBoard().getHomes());
            gen.writeObjectField("hands", game.getHands());
            gen.writeEndObject();
        }
    }
}
