package org.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.utils.enums.Positions;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PositionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Group: DEFENDERS, MIDFIELDERS, FORWARDS
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Positions positionGroup;

    // Value: CB, LB, CDM, ST, etc.
    @Column(nullable = false)
    private String name;
}
