package com.example.backend.exception;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.dto.response.api.ApiResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Bắt lỗi validate dữ liệu từ @Valid ở request body.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .toList();

        return buildResponse(HttpStatus.BAD_REQUEST, 400, "Dữ liệu không hợp lệ", errors);
    }

    // Bắt lỗi bind dữ liệu khi Spring không map được request vào DTO/parameter.
    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiResponse<Object>> handleBindException(BindException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + fieldError.getDefaultMessage())
                .toList();

        return buildResponse(HttpStatus.BAD_REQUEST, 400, "Dữ liệu không hợp lệ", errors);
    }

    // Bắt lỗi vi phạm constraint như @NotNull, @Size, @Pattern trên request param/path.
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        List<String> errors = ex.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                .toList();

        return buildResponse(HttpStatus.BAD_REQUEST, 400, "Dữ liệu không hợp lệ", errors);
    }

    // Bắt lỗi thiếu request parameter bắt buộc.
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<Object>> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, 400, "Thiếu tham số bắt buộc: " + ex.getParameterName(), null);
    }

    // Bắt lỗi thiếu part bắt buộc trong multipart/form-data, thường gặp khi upload file.
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiResponse<Object>> handleMissingServletRequestPart(MissingServletRequestPartException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, 400, "Thiếu file hoặc dữ liệu tải lên: " + ex.getRequestPartName(), null);
    }

    // Bắt lỗi request body không đọc được, ví dụ JSON sai định dạng.
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, 400, "Dữ liệu gửi lên không hợp lệ", null);
    }

    // Bắt lỗi client gửi sai Content-Type so với API yêu cầu.
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex) {
        return buildResponse(HttpStatus.UNSUPPORTED_MEDIA_TYPE, 415, "Kiểu dữ liệu gửi lên không được hỗ trợ", null);
    }

    // Bắt lỗi server không trả được định dạng mà client yêu cầu qua Accept header.
    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpMediaTypeNotAcceptable(HttpMediaTypeNotAcceptableException ex) {
        return buildResponse(HttpStatus.NOT_ACCEPTABLE, 406, "Không hỗ trợ định dạng phản hồi này", null);
    }

    // Bắt lỗi sai kiểu dữ liệu của tham số, ví dụ truyền chữ vào id kiểu số.
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Object>> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, 400,
                "Giá trị của tham số '" + ex.getName() + "' không hợp lệ", null);
    }

    // Bắt lỗi không tìm thấy tài khoản khi load user trong security/authentication flow.
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUsernameNotFound(UsernameNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, 404, "Tài khoản không tồn tại", null);
    }

    // Bắt lỗi không đủ quyền truy cập vào tài nguyên.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDeniedException(AccessDeniedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, 403, "Bạn không có quyền truy cập", null);
    }

    // Bắt lỗi xác thực thất bại, thường từ security layer.
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationException(AuthenticationException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, 401, "Đăng nhập không thành công", null);
    }

    // Bắt các exception có gắn status code cụ thể bằng ResponseStatusException.
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatusException(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        String message = ex.getReason() != null ? ex.getReason() : "Có lỗi xảy ra, vui lòng thử lại";
        return buildResponse(status, status.value(), message, null);
    }

    // Bắt lỗi nghiệp vụ đơn giản do validate thủ công trong service.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, 400, ex.getMessage(), null);
    }

    // Bắt lỗi bad request nghiệp vụ do project tự định nghĩa.
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(BadRequestException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, 400, ex.getMessage(), null);
    }

    // Bắt lỗi xung đột dữ liệu nghiệp vụ do project tự định nghĩa.
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiResponse<Object>> handleConflict(ConflictException ex) {
        return buildResponse(HttpStatus.CONFLICT, 409, ex.getMessage(), null);
    }

    // Bắt lỗi không tìm thấy tài nguyên do project tự định nghĩa.
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(NotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, 404, ex.getMessage(), null);
    }

    // Bắt lỗi chưa đăng nhập hoặc token không hợp lệ do project tự định nghĩa.
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorized(UnauthorizedException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, 401, ex.getMessage(), null);
    }

    // Bắt lỗi không đủ quyền do project tự định nghĩa.
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiResponse<Object>> handleForbidden(ForbiddenException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, 403, ex.getMessage(), null);
    }

    // Bắt toàn bộ lỗi chưa được xử lý ở các handler khác và ghi log để debug.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        log.error("Unhandled exception", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, 500, "Lỗi hệ thống, vui lòng thử lại sau", null);
    }

    // Chuẩn hóa response lỗi theo ApiResponse để API trả về nhất quán.
    private ResponseEntity<ApiResponse<Object>> buildResponse(HttpStatus status, int code, String message, Object data) {
        return ResponseEntity.status(status).body(new ApiResponse<>(code, message, data));
    }
}