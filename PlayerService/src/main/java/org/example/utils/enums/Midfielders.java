package org.example.utils.enums;

import lombok.Getter;

/**
 * Enum representing midfielder positions in football (soccer).
 */
@Getter
public enum Midfielders {
    CDM("Defensive Midfielder"),
    CM("Centre Midfielder"),
    CAM("Central Attacking Midfielder"),
    RM("Right Midfielder"),
    LM("Left Midfielder");

    private final String fullName;

    Midfielders(String s) {
        this.fullName = s;
    }
}
