package com.usguri.health_hub.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
    info =
        @Info(
            title = "Health Hub",
            description = "OpenAPI documentation for Health Hub",
            version = "0.1.0"),
    servers = {
      @Server(description = "Local ENV", url = "http://localhost:7777"),
      @Server(description = "Production ENV", url = "https://healthhub.org")
    },
    security = {
            @SecurityRequirement(
                    name = "bearerAuth"
            )
    }
    )
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT Authentication",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenAPIConfig {}
