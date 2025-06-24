package org.example.utils;

import lombok.Getter;

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
