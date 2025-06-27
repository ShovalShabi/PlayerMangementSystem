package org.example.etc;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for REST controllers.
 * Handles ResponseStatusException and generic exceptions, returning appropriate
 * HTTP responses.
 */
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle ResponseStatusException and return its status and reason.
     *
     * @param ex the exception
     * @return the response entity with status and reason
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex) {
        // Let Spring handle it as usual
        return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
    }

    /**
     * Handle validation errors and return HTTP 400 Bad Request with details.
     *
     * @param ex the MethodArgumentNotValidException
     * @return the response entity with status 400 and error details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    /**
     * Handle all other exceptions and return HTTP 500 Internal Server Error.
     *
     * @param ex the exception
     * @return the response entity with status 500
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleOtherExceptions(Exception ex) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Internal server error");
    }
}