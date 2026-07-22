package com.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String username;
    private String role;
    private String tokenType = "Bearer";

    public JwtResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }
}
