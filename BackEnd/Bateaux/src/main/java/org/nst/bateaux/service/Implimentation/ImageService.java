package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.repository.ImageRepository;
import org.nst.bateaux.service.Interface.IBateauxService;
import org.nst.bateaux.service.Interface.IImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ImageService  implements IImageService {

    @Autowired
    ImageRepository imageRepository ;


    @Override
    public Image ajouterImage(Image image)
    {

        return imageRepository.save(image);
    }

    @Override
    public void supprimerImage(Long id)
    {
        imageRepository.deleteById(id);
    }

    @Override
    public Image updateImage(Long id,Image image)
    {
        Image i=imageRepository.findById(id).orElse(null);
        i.setUrl(image.getUrl());
        return imageRepository.save(i);
    }

    @Override
    public Optional<Image> chercherImage(Long id)
    {
        return imageRepository.findById(id);
    }

    @Override
    public List<Image> getAll() {return imageRepository.findAll();}
}
