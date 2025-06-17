package org.nst.bateaux.dto.auth;

import lombok.*;
import org.nst.bateaux.entity.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
}
