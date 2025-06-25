package org.example.utils.enums;


import lombok.Getter;

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
