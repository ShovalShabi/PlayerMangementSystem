package org.example.utils.enums;

import lombok.Getter;

/**
 * Enum representing defender positions in football (soccer).
 */
@Getter
public enum Defenders {
    CB("Centre-Back"),
    RB("Right-Back"),
    LB("Left-Back"),
    LWB("Left Wing-Back"),
    RWB("Right Wing-Back");

    private final String fullName;

    Defenders(String s) {
        this.fullName = s;
    }
}
