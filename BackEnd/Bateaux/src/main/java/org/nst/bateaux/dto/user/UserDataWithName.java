package org.nst.bateaux.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.nst.bateaux.entity.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDataWithName {
    public Long id;
    public String name;
    public String email;
    public String phone;
    public Role role;
    public Boolean isActive;
}
