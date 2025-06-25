package org.example.etc;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

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