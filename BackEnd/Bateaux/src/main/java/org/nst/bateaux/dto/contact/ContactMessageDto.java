package org.nst.bateaux.dto.contact;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactMessageDto {
        private String name;

        private String email;

        private String subject;
        private String message;
}
