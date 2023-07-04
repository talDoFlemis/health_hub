package com.usguri.health_hub.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomFieldError {
  private String field;
  private String error;
}
