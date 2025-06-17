package org.nst.bateaux.service.Interface;

import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;

import java.util.List;
import java.util.Optional;

public interface IImageService {

    Image ajouterImage(Image image) ;
    void supprimerImage(Long id);
    Image updateImage(Long id,Image image);
    Optional<Image> chercherImage(Long id);
    List<Image> getAll();
}
