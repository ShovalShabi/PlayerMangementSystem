package org.example.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlayerDTO {
    private String firstName;
    private String lastName;
    private Set<String> nationalities;
    private Set<String> positions;
    private LocalDate dateOfBirth;
    private Double height;
}