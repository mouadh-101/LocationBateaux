package org.nst.bateaux.service.Interface;

import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface IImageService {

    ResponseEntity<ImageDto> ajouterImage(MultipartFile file) ;
    ResponseEntity<Void> deleteImage(Long id);
    ImageDto updateImage(Long id,ImageDto image);
    ImageDto chercherImage(Long id);
    List<ImageDto> getAll();
}
