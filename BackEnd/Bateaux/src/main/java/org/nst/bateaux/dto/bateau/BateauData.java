package org.nst.bateaux.dto.bateau;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BateauData {
    String nom ;
    String description ;
    double prix ;
    List<ImageDto> images;
}
