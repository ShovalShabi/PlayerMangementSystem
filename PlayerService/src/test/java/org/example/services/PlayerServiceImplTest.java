package org.example.services;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.example.dtos.PlayerDTO;
import org.example.dtos.UpdatePlayerDTO;
import org.example.entities.NationalityEntity;
import org.example.entities.PlayerEntity;
import org.example.entities.PositionEntity;
import org.example.repositories.PlayerRepository;
import org.example.utils.enums.SortBy;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlayerServiceImplTest {
    @Mock
    private PlayerRepository playerRepository;
    @Mock
    private Validator validator;
    @Mock
    private MultipartFile multipartFile;

    @InjectMocks
    private PlayerServiceImpl playerService;

    private PlayerDTO validPlayerDTO;
    private PlayerEntity validPlayerEntity;
    private UpdatePlayerDTO validUpdatePlayerDTO;

    @BeforeEach
    void setUp() {
        validPlayerDTO = new PlayerDTO(
                1L,
                "Lionel",
                "Messi",
                Set.of("Argentina"),
                LocalDate.of(1987, 6, 24),
                Set.of("ST", "CAM"),
                1.70,
                new Date(),
                new Date());
        validPlayerEntity = new PlayerEntity(
                1L,
                "Lionel",
                "Messi",
                new HashSet<>(Set.of(new NationalityEntity(null, "Argentina"))),
                new HashSet<>(Set.of(new PositionEntity(null, null, "ST"))),
                LocalDate.of(1987, 6, 24),
                1.70,
                new Date(),
                new Date());
        validUpdatePlayerDTO = new UpdatePlayerDTO(
                "Leo",
                "Messi",
                Set.of("Argentina"),
                Set.of("ST"),
                LocalDate.of(1987, 6, 24),
                1.70);
    }

    @Nested
    @DisplayName("createPlayer")
    class CreatePlayer {
        @Test
        void createsPlayerSuccessfully() {

            when(playerRepository.save(any(PlayerEntity.class))).thenReturn(validPlayerEntity);

            PlayerDTO result = playerService.createPlayer(validPlayerDTO);
            assertThat(result.getFirstName()).isEqualTo("Lionel");
            verify(playerRepository).save(any(PlayerEntity.class));
        }

        @Test
        void throwsIfDuplicatePlayer() {
            when(playerRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(any(), any(), any()))
                    .thenReturn(true);
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.createPlayer(validPlayerDTO));
            assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        }

        @Test
        void throwsIfDateOfBirthInvalid() {
            PlayerDTO dto = new PlayerDTO(validPlayerDTO.getId(), validPlayerDTO.getFirstName(),
                    validPlayerDTO.getLastName(), validPlayerDTO.getNationalities(),
                    validPlayerDTO.getDateOfBirth(), validPlayerDTO.getPositions(),
                    validPlayerDTO.getHeight(), null, null);

            dto.setDateOfBirth(LocalDate.now().plusDays(1));
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.createPlayer(dto));
            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        void throwsIfHeightNull() {
            PlayerDTO dto = new PlayerDTO(validPlayerDTO.getId(), validPlayerDTO.getFirstName(),
                    validPlayerDTO.getLastName(), validPlayerDTO.getNationalities(),
                    validPlayerDTO.getDateOfBirth(), validPlayerDTO.getPositions(),
                    validPlayerDTO.getHeight(), null, null);
            dto.setHeight(null);
            when(playerRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(any(), any(), any()))
                    .thenReturn(false);
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.createPlayer(dto));
            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        void throwsIfNationalitiesNull() {
            PlayerDTO dto = new PlayerDTO(validPlayerDTO.getId(), validPlayerDTO.getFirstName(),
                    validPlayerDTO.getLastName(), validPlayerDTO.getNationalities(),
                    validPlayerDTO.getDateOfBirth(), validPlayerDTO.getPositions(),
                    validPlayerDTO.getHeight(), null, null);
            dto.setNationalities(null);
            when(playerRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(any(), any(), any()))
                    .thenReturn(false);
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.createPlayer(dto));
            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        void throwsIfPositionsNull() {
            PlayerDTO dto = new PlayerDTO(validPlayerDTO.getId(), validPlayerDTO.getFirstName(),
                    validPlayerDTO.getLastName(), validPlayerDTO.getNationalities(),
                    validPlayerDTO.getDateOfBirth(), validPlayerDTO.getPositions(),
                    validPlayerDTO.getHeight(), null, null);
            dto.setPositions(null);
            when(playerRepository.existsByFirstNameIgnoreCaseAndLastNameIgnoreCaseAndDateOfBirth(any(), any(), any()))
                    .thenReturn(false);
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.createPlayer(dto));
            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }
    }

    @Nested
    @DisplayName("updatePlayer")
    class UpdatePlayer {
        @Test
        void updatesPlayerSuccessfully() {
            when(playerRepository.findById(anyLong())).thenReturn(Optional.of(validPlayerEntity));
            when(playerRepository.saveAndFlush(any(PlayerEntity.class))).thenReturn(validPlayerEntity);
            when(validator.validate(any(PlayerDTO.class))).thenReturn(Collections.emptySet());

            PlayerDTO result = playerService.updatePlayer(1L, validUpdatePlayerDTO);
            assertThat(result.getFirstName()).isEqualTo("Leo");
            verify(playerRepository).saveAndFlush(any(PlayerEntity.class));
        }

        @Test
        void throwsIfPlayerNotFound() {
            when(playerRepository.findById(anyLong())).thenReturn(Optional.empty());
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.updatePlayer(1L, validUpdatePlayerDTO));
            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }

        @Test
        void throwsIfValidationFails() {
            when(playerRepository.findById(anyLong())).thenReturn(Optional.of(validPlayerEntity));
            when(validator.validate(any(PlayerDTO.class))).thenReturn(Set.of(mock(ConstraintViolation.class)));
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.updatePlayer(1L, validUpdatePlayerDTO));
            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }
    }

    @Nested
    @DisplayName("deletePlayer")
    class DeletePlayer {
        @Test
        void deletesPlayerSuccessfully() {
            doNothing().when(playerRepository).deleteById(1L);
            playerService.deletePlayer(1L);
            verify(playerRepository).deleteById(1L);
        }
    }

    @Nested
    @DisplayName("getPlayerById")
    class GetPlayerById {
        @Test
        void getsPlayerSuccessfully() {
            when(playerRepository.findById(1L)).thenReturn(Optional.of(validPlayerEntity));
            PlayerDTO result = playerService.getPlayerById(1L);
            assertThat(result.getFirstName()).isEqualTo("Lionel");
        }

        @Test
        void throwsIfPlayerNotFound() {
            when(playerRepository.findById(1L)).thenReturn(Optional.empty());
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.getPlayerById(1L));
            assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        }
    }

    @Nested
    @DisplayName("getPlayers")
    class GetPlayers {
        @Test
        void getsPlayersWithFilters() {
            List<PlayerEntity> entities = List.of(validPlayerEntity);
            Page<PlayerEntity> page = new PageImpl<>(entities, PageRequest.of(0, 10), 1);
            when(playerRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
            Page<PlayerDTO> result = playerService.getPlayers("Leo", List.of("Argentina"), 20, 40, List.of("ST"), 1.6,
                    1.8, SortBy.NAME, "asc", 0, 10);
            assertThat(result.getContent()).hasSize(1);
        }
    }

    @Nested
    @DisplayName("getAll")
    class GetAll {
        @Test
        void getsAllPlayers() {
            when(playerRepository.findAll()).thenReturn(List.of(validPlayerEntity));
            List<PlayerDTO> result = playerService.getAll();
            assertThat(result).hasSize(1);
        }
    }

    @Nested
    @DisplayName("deleteAll")
    class DeleteAll {
        @Test
        void deletesAllPlayers() {
            doNothing().when(playerRepository).deleteAll();
            playerService.deleteAll();
            verify(playerRepository).deleteAll();
        }
    }

    @Nested
    @DisplayName("bulkUploadPlayers")
    class BulkUploadPlayers {
        @Test
        void throwsIfFileIsEmpty() {
            when(multipartFile.isEmpty()).thenReturn(true);
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.bulkUploadPlayers(multipartFile));
            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }

        @Test
        void throwsIfHeaderMissing() throws IOException {
            when(multipartFile.isEmpty()).thenReturn(false);
            when(multipartFile.getInputStream()).thenReturn(new ByteArrayInputStream(new byte[0]));
            ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                    () -> playerService.bulkUploadPlayers(multipartFile));
            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        }
    }
}
