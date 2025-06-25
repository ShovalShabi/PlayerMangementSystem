package org.example.utils.classes;

import org.example.utils.enums.Positions;

/**
 * Utility class for position-related helper methods.
 */
public class PositionUtils {
    public static Positions resolvePositionGroup(String code) {
        for (Positions group : Positions.values()) {
            Class<? extends Enum<?>> subEnum = group.getTypeClass();
            for (Enum<?> constant : subEnum.getEnumConstants()) {
                if (constant.name().equalsIgnoreCase(code)) {
                    return group;
                }
            }
        }
        throw new IllegalArgumentException("Unknown position code: " + code);
    }
}