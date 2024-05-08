package com.example.pegsandjokers.api.controller.model;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class HandSerializer extends JsonSerializer<Hand> {
    @Override
    public void serialize(Hand hand, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (hand == null) {
            gen.writeNull();
        } else {
            gen.writeStartObject();
            gen.writeObjectField("cards", hand.getCards());
            gen.writeEndObject();
        }
    }
}
