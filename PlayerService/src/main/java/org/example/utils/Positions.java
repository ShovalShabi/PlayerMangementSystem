package org.example.utils;


import lombok.Getter;

@Getter
public enum Positions {
    Defenders(Defenders.class),
    Midfielders(Midfielders.class),
    Forwards(Forwards.class);

    private final Class<? extends Enum<?>> typeClass;

    Positions(Class<? extends Enum<?>> typeClass) {
        this.typeClass = typeClass;
    }
}