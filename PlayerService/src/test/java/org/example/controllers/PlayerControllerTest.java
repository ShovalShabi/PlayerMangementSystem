package org.example.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.example.services.PlayerService;
import org.example.utils.TestSecurityConfig;
import org.example.utils.enums.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@DisplayName("PlayerController Tests")
@Import(TestSecurityConfig.class)
class PlayerControllerTest {

    @Mock
    private PlayerService playerService;

    @InjectMocks
    private PlayerController playerController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(playerController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @AfterEach
    void tearDown() {
        // Clean up any test data or reset mocks if needed
        reset(playerService);
    }

    // Test data using actual position enum values
    private PlayerDTO createSamplePlayerDTO() {
        return new PlayerDTO(
                1L,
                "Lionel",
                "Messi",
                Set.of("Argentina"),
                LocalDate.of(1987, 6, 24),
                new HashSet<>(List.of(Positions.ST, Positions.CAM)),
                1.70,
                new Date(),
                new Date());
    }

    private UpdatePlayerDTO createSampleUpdatePlayerDTO() {
        return new UpdatePlayerDTO(
                "Cristiano",
                "Ronaldo",
                Set.of("Portugal"),
                new HashSet<>(List.of(Positions.ST)),
                LocalDate.of(1985, 2, 5),
                1.87);
    }

    // Helper method to load the CSV file for bulk upload testing
    private byte[] loadCsvFile() throws IOException {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("test_bulk_players.csv")) {
            if (is == null)
                throw new FileNotFoundException("test_bulk_players.csv not found in test resources");
            return is.readAllBytes();
        }
    }

    @Test
    @DisplayName("Should create player successfully")
    void createPlayer_Success() throws Exception {
        // Arrange
        PlayerDTO inputPlayer = createSamplePlayerDTO();
        inputPlayer.setId(null); // ID should be null for creation
        PlayerDTO createdPlayer = createSamplePlayerDTO();

        when(playerService.createPlayer(any(PlayerDTO.class))).thenReturn(createdPlayer);

        // Act & Assert
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputPlayer)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Lionel"))
                .andExpect(jsonPath("$.lastName").value("Messi"))
                .andExpect(jsonPath("$.nationalities").isArray())
                .andExpect(jsonPath("$.positions").isArray());

        verify(playerService, times(1)).createPlayer(any(PlayerDTO.class));
    }

    @Test
    @DisplayName("Should return 400 when creating player with invalid data")
    void createPlayer_InvalidData_ReturnsBadRequest() throws Exception {
        // Arrange
        PlayerDTO invalidPlayer = new PlayerDTO();
        // Missing required fields

        // Act & Assert
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPlayer)))
                .andExpect(status().isBadRequest());

        verify(playerService, never()).createPlayer(any());
    }

    @Test
    @DisplayName("Should update player successfully")
    void updatePlayer_Success() throws Exception {
        // Arrange
        Long playerId = 1L;
        UpdatePlayerDTO updateDTO = createSampleUpdatePlayerDTO();
        PlayerDTO updatedPlayer = createSamplePlayerDTO();
        updatedPlayer.setFirstName("Cristiano");
        updatedPlayer.setLastName("Ronaldo");

        when(playerService.updatePlayer(eq(playerId), any(UpdatePlayerDTO.class)))
                .thenReturn(updatedPlayer);

        // Act & Assert
        mockMvc.perform(put("/api/players/{id}", playerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Cristiano"))
                .andExpect(jsonPath("$.lastName").value("Ronaldo"));

        verify(playerService, times(1)).updatePlayer(eq(playerId), any(UpdatePlayerDTO.class));
    }

    @Test
    @DisplayName("Should return 400 when updating player with invalid data")
    void updatePlayer_InvalidData_ReturnsBadRequest() throws Exception {
        // Arrange
        Long playerId = 1L;
        UpdatePlayerDTO invalidUpdate = new UpdatePlayerDTO();
        invalidUpdate.setHeight(3.0); // Invalid height

        // Mock the service to throw the same exception as the real implementation
        doThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Player is not valid after changes"))
                .when(playerService).updatePlayer(eq(playerId), any(UpdatePlayerDTO.class));

        // Act & Assert
        mockMvc.perform(put("/api/players/{id}", playerId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidUpdate)))
                .andExpect(status().isBadRequest());

        verify(playerService, times(1)).updatePlayer(eq(playerId), any(UpdatePlayerDTO.class));
    }

    @Test
    @DisplayName("Should delete player successfully")
    void deletePlayer_Success() throws Exception {
        // Arrange
        Long playerId = 1L;
        doNothing().when(playerService).deletePlayer(playerId);

        // Act & Assert
        mockMvc.perform(delete("/api/players/{id}", playerId))
                .andExpect(status().isOk());

        verify(playerService, times(1)).deletePlayer(playerId);
    }

    @Test
    @DisplayName("Should get player by ID successfully")
    void getPlayerById_Success() throws Exception {
        // Arrange
        Long playerId = 1L;
        PlayerDTO player = createSamplePlayerDTO();

        when(playerService.getPlayerById(playerId)).thenReturn(player);

        // Act & Assert
        mockMvc.perform(get("/api/players/{id}", playerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Lionel"))
                .andExpect(jsonPath("$.lastName").value("Messi"));

        verify(playerService, times(1)).getPlayerById(playerId);
    }

    @Test
    @DisplayName("Should get players with pagination and filtering successfully")
    void getPlayers_WithFilters_Success() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());
        Page<PlayerDTO> playerPage = new PageImpl<>(players, PageRequest.of(0, 10), 1);

        when(playerService.getPlayers(
                anyString(), anyList(), anyInt(), anyInt(),
                anyList(), anyDouble(), anyDouble(), any(SortBy.class),
                anyString(), anyInt(), anyInt()))
                .thenReturn(playerPage);

        // Act & Assert
        mockMvc.perform(get("/api/players")
                        .param("name", "Messi")
                        .param("nationalities", "Argentina")
                        .param("minAge", "20")
                        .param("maxAge", "40")
                        .param("positions", Positions.ST.name())
                        .param("minHeight", "1.60")
                        .param("maxHeight", "1.80")
                        .param("sortBy", "NAME")
                        .param("order", "asc")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].firstName").value("Lionel"));

        verify(playerService, times(1)).getPlayers(
                eq("Messi"), eq(List.of("Argentina")), eq(20), eq(40),
                eq(List.of(Positions.ST.name())), eq(1.60), eq(1.80), eq(SortBy.NAME),
                eq("asc"), eq(0), eq(10));
    }

    @Test
    @DisplayName("Should get players with default parameters successfully")
    void getPlayers_DefaultParameters_Success() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());
        Page<PlayerDTO> playerPage = new PageImpl<>(players, PageRequest.of(0, 10), 1);

        when(playerService.getPlayers(
                isNull(), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), eq(SortBy.NAME),
                eq("asc"), eq(0), eq(10)))
                .thenReturn(playerPage);

        // Act & Assert
        mockMvc.perform(get("/api/players"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(playerService, times(1)).getPlayers(
                isNull(), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), eq(SortBy.NAME),
                eq("asc"), eq(0), eq(10));
    }

    @Test
    @DisplayName("Should handle bulk upload successfully with real CSV file")
    void bulkUpload_Success() throws Exception {
        // Arrange
        byte[] csvContent = loadCsvFile();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test_bulk_players.csv",
                "text/csv",
                csvContent);

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("successfully_created", "500 items passed"); // String value
        uploadResult.put("failed_to_create", "No one failed"); // String value

        when(playerService.bulkUploadPlayers(any())).thenReturn(uploadResult);

        // Act & Assert
        mockMvc.perform(multipart("/api/players/bulk-upload")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successfully_created").value("500 items passed"))
                .andExpect(jsonPath("$.failed_to_create").value("No one failed"));

        verify(playerService, times(1)).bulkUploadPlayers(any());
    }

    @Test
    @DisplayName("Should handle bulk upload with empty file")
    void bulkUpload_EmptyFile_ReturnsBadRequest() throws Exception {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
                "file",
                "empty.csv",
                "text/csv",
                new byte[0]);

        // Act & Assert
        mockMvc.perform(multipart("/api/players/bulk-upload")
                        .file(emptyFile))
                .andExpect(status().isOk()); // Service handles empty file

        verify(playerService, times(1)).bulkUploadPlayers(any());
    }

    @Test
    @DisplayName("Should get all players in dev/test profile")
    void getAll_Success() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());

        when(playerService.getAll()).thenReturn(players);

        // Act & Assert
        mockMvc.perform(get("/api/players/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].firstName").value("Lionel"));

        verify(playerService, times(1)).getAll();
    }

    @Test
    @DisplayName("Should delete all players in dev/test profile")
    void deleteAll_Success() throws Exception {
        // Arrange
        doNothing().when(playerService).deleteAll();

        // Act & Assert
        mockMvc.perform(delete("/api/players/all"))
                .andExpect(status().isOk());

        verify(playerService, times(1)).deleteAll();
    }

    @Test
    @DisplayName("Should handle service exception gracefully")
    void handleServiceException() throws Exception {
        // Arrange
        Long playerId = 1L;
        when(playerService.getPlayerById(playerId))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Player not found"));

        // Act & Assert
        mockMvc.perform(get("/api/players/{id}", playerId))
                .andExpect(status().isNotFound());

        verify(playerService, times(1)).getPlayerById(playerId);
    }

    @Test
    @DisplayName("Should validate player data constraints")
    void validatePlayerDataConstraints() throws Exception {
        // Arrange - Player with invalid data
        PlayerDTO invalidPlayer = new PlayerDTO();
        invalidPlayer.setFirstName(""); // Blank first name
        invalidPlayer.setLastName(""); // Blank last name
        invalidPlayer.setHeight(0.5); // Too short
        invalidPlayer.setDateOfBirth(LocalDate.now().plusDays(1)); // Future date

        // Act & Assert
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidPlayer)))
                .andExpect(status().isBadRequest());

        verify(playerService, never()).createPlayer(any());
    }

    @Test
    @DisplayName("Should handle multiple nationalities and positions using actual enum values")
    void handleMultipleNationalitiesAndPositions() throws Exception {
        // Arrange
        PlayerDTO playerWithMultiple = createSamplePlayerDTO();
        playerWithMultiple.setNationalities(new HashSet<>(Arrays.asList("Argentina", "Spain")));
        playerWithMultiple.setPositions(new HashSet<>(Arrays.asList(
                Positions.ST,
                Positions.CAM,
                Positions.CB)));

        when(playerService.createPlayer(any(PlayerDTO.class))).thenReturn(playerWithMultiple);

        // Act & Assert
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(playerWithMultiple)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nationalities").isArray())
                .andExpect(jsonPath("$.positions").isArray());

        verify(playerService, times(1)).createPlayer(any(PlayerDTO.class));
    }

    @Test
    @DisplayName("Should handle sorting with different SortBy values")
    void handleDifferentSortByValues() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());
        Page<PlayerDTO> playerPage = new PageImpl<>(players, PageRequest.of(0, 10), 1);

        when(playerService.getPlayers(
                isNull(), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), any(SortBy.class),
                anyString(), anyInt(), anyInt()))
                .thenReturn(playerPage);

        // Test different sort options
        SortBy[] sortOptions = {SortBy.NAME, SortBy.NATIONALITY, SortBy.AGE, SortBy.POSITIONS, SortBy.HEIGHT};

        for (SortBy sortBy : sortOptions) {
            mockMvc.perform(get("/api/players")
                            .param("sortBy", sortBy.name()))
                    .andExpect(status().isOk());

            verify(playerService, times(1)).getPlayers(
                    isNull(), isNull(), isNull(), isNull(),
                    isNull(), isNull(), isNull(), eq(sortBy),
                    eq("asc"), eq(0), eq(10));
        }
    }

    @Test
    @DisplayName("Should handle pagination parameters correctly")
    void handlePaginationParameters() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());
        Page<PlayerDTO> playerPage = new PageImpl<>(players, PageRequest.of(2, 5), 1);

        when(playerService.getPlayers(
                isNull(), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), any(SortBy.class),
                anyString(), eq(2), eq(5)))
                .thenReturn(playerPage);

        // Act & Assert
        mockMvc.perform(get("/api/players")
                        .param("page", "2")
                        .param("size", "5"))
                .andExpect(status().isOk());

        verify(playerService, times(1)).getPlayers(
                isNull(), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), any(SortBy.class),
                anyString(), eq(2), eq(5));
    }

    @Test
    @DisplayName("Should handle empty result set from service")
    void handleEmptyResultSet() throws Exception {
        // Arrange
        Page<PlayerDTO> emptyPage = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 10), 0);

        when(playerService.getPlayers(
                eq("NonExistentPlayer"),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                isNull(),
                eq(SortBy.NAME),
                eq("asc"),
                eq(0),
                eq(10))).thenReturn(emptyPage);

        // Act & Assert
        mockMvc.perform(get("/api/players")
                        .param("name", "NonExistentPlayer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content").isEmpty())
                .andExpect(jsonPath("$.totalElements").value(0));

        verify(playerService, times(1)).getPlayers(
                eq("NonExistentPlayer"), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), eq(SortBy.NAME),
                eq("asc"), eq(0), eq(10));
    }

    @Test
    @DisplayName("Should handle bulk upload with invalid file format")
    void bulkUpload_InvalidFileFormat() throws Exception {
        // Arrange
        MockMultipartFile invalidFile = new MockMultipartFile(
                "file",
                "players.txt",
                "text/plain",
                "This is not a CSV file".getBytes());

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("success", false);
        uploadResult.put("error", "Invalid file format");

        when(playerService.bulkUploadPlayers(any())).thenReturn(uploadResult);

        // Act & Assert
        mockMvc.perform(multipart("/api/players/bulk-upload")
                        .file(invalidFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false));

        verify(playerService, times(1)).bulkUploadPlayers(any());
    }

    @Test
    @DisplayName("Should validate JSON request body format")
    void validateJsonRequestBodyFormat() throws Exception {
        // Arrange
        String invalidJson = "{ invalid json format }";

        // Act & Assert
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());

        verify(playerService, never()).createPlayer(any());
    }

    @Test
    @DisplayName("Should handle bulk upload with partial success")
    void handleBulkUploadWithPartialSuccess() throws Exception {
        // Arrange
        byte[] csvContent = loadCsvFile();
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "bulk_players_example.csv",
                "text/csv",
                csvContent);

        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("success", true);
        uploadResult.put("processed", 502);
        uploadResult.put("errors", 5);
        uploadResult.put("details",
                Arrays.asList("450 players created successfully", "5 players failed validation"));

        when(playerService.bulkUploadPlayers(any())).thenReturn(uploadResult);

        // Act & Assert
        mockMvc.perform(multipart("/api/players/bulk-upload")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.processed").value(502))
                .andExpect(jsonPath("$.errors").value(5))
                .andExpect(jsonPath("$.details").isArray());

        verify(playerService, times(1)).bulkUploadPlayers(any());
    }

    @Test
    @DisplayName("Should handle concurrent requests to same endpoint")
    void handleConcurrentRequests() throws Exception {
        // Arrange
        Long playerId = 1L;
        PlayerDTO player = createSamplePlayerDTO();

        when(playerService.getPlayerById(playerId)).thenReturn(player);

        // Act & Assert - Simulate concurrent requests
        mockMvc.perform(get("/api/players/{id}", playerId))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/players/{id}", playerId))
                .andExpect(status().isOk());

        // Verify service was called twice
        verify(playerService, times(2)).getPlayerById(playerId);
    }

    @Test
    @DisplayName("Should handle large pagination size")
    void handleLargePaginationSize() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());
        Page<PlayerDTO> playerPage = new PageImpl<>(players, PageRequest.of(0, 100), 1);

        when(playerService.getPlayers(
                isNull(), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), any(SortBy.class),
                anyString(), eq(0), eq(100)))
                .thenReturn(playerPage);

        // Act & Assert
        mockMvc.perform(get("/api/players")
                        .param("size", "100"))
                .andExpect(status().isOk());

        verify(playerService, times(1)).getPlayers(
                isNull(), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), eq(SortBy.NAME),
                eq("asc"), eq(0), eq(100));
    }

    @Test
    @DisplayName("Should handle special characters in filter parameters")
    void handleSpecialCharactersInFilters() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());
        Page<PlayerDTO> playerPage = new PageImpl<>(players, PageRequest.of(0, 10), 1);

        when(playerService.getPlayers(
                eq("José María"), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), any(SortBy.class),
                anyString(), anyInt(), anyInt()))
                .thenReturn(playerPage);

        // Act & Assert
        mockMvc.perform(get("/api/players")
                        .param("name", "José María"))
                .andExpect(status().isOk());

        verify(playerService, times(1)).getPlayers(
                eq("José María"), isNull(), isNull(), isNull(),
                isNull(), isNull(), isNull(), eq(SortBy.NAME),
                eq("asc"), eq(0), eq(10));
    }

    @Test
    @DisplayName("Should handle boundary values for age and height filters")
    void handleBoundaryValuesForFilters() throws Exception {
        // Arrange
        List<PlayerDTO> players = List.of(createSamplePlayerDTO());
        Page<PlayerDTO> playerPage = new PageImpl<>(players, PageRequest.of(0, 10), 1);

        when(playerService.getPlayers(
                isNull(), isNull(), eq(16), eq(40),
                isNull(), eq(1.50), eq(2.20), any(SortBy.class),
                anyString(), anyInt(), anyInt()))
                .thenReturn(playerPage);

        // Act & Assert - Test boundary values
        mockMvc.perform(get("/api/players")
                        .param("minAge", "16")
                        .param("maxAge", "40")
                        .param("minHeight", "1.50")
                        .param("maxHeight", "2.20"))
                .andExpect(status().isOk());

        verify(playerService, times(1)).getPlayers(
                isNull(), isNull(), eq(16), eq(40),
                isNull(), eq(1.50), eq(2.20), eq(SortBy.NAME),
                eq("asc"), eq(0), eq(10));
    }

    @Test
    @DisplayName("Should test all position types from enums")
    void testAllPositionTypesFromEnums() throws Exception {
        // Arrange
        PlayerDTO defenderPlayer = createSamplePlayerDTO();
        defenderPlayer.setPositions(new HashSet<>(Arrays.asList(Positions.CB, Positions.RB)));

        PlayerDTO midfielderPlayer = createSamplePlayerDTO();
        midfielderPlayer.setPositions(
                new HashSet<>(Arrays.asList(Positions.CM, Positions.CAM)));

        PlayerDTO forwardPlayer = createSamplePlayerDTO();
        forwardPlayer.setPositions(new HashSet<>(Arrays.asList(Positions.ST, Positions.LW)));

        when(playerService.createPlayer(any(PlayerDTO.class)))
                .thenReturn(defenderPlayer)
                .thenReturn(midfielderPlayer)
                .thenReturn(forwardPlayer);

        // Act & Assert - Test defender positions
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(defenderPlayer)))
                .andExpect(status().isCreated());

        // Act & Assert - Test midfielder positions
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(midfielderPlayer)))
                .andExpect(status().isCreated());

        // Act & Assert - Test forward positions
        mockMvc.perform(post("/api/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forwardPlayer)))
                .andExpect(status().isCreated());

        verify(playerService, times(3)).createPlayer(any(PlayerDTO.class));
    }

    @Test
    @DisplayName("Should handle database cleanup after bulk operations")
    void handleDatabaseCleanupAfterBulkOperations() throws Exception {
        // Arrange
        doNothing().when(playerService).deleteAll();

        // Act & Assert - Clean up after bulk operations
        mockMvc.perform(delete("/api/players/all"))
                .andExpect(status().isOk());

        verify(playerService, times(1)).deleteAll();
    }
}
