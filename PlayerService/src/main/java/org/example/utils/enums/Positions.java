package org.example.utils.enums;

import lombok.Getter;

/**
 * Enum representing all possible player positions, grouped by type (Defenders,
 * Midfielders, Forwards).
 */
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