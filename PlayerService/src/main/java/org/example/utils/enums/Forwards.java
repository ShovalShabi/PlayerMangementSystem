package org.example.utils.enums;

import lombok.Getter;

/**
 * Enum representing forward positions in football (soccer).
 */
@Getter
public enum Forwards {
    RF("Right Forward"),
    LF("Left Forward"),
    CF("Centre Forward"),
    ST("Striker"),
    LW("Left Wing"),
    RW("Right Wing");

    private final String fullName;

    Forwards(String s) {
        this.fullName = s;
    }
}
