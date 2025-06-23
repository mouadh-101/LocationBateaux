package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.nst.bateaux.service.Implimentation.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/Image")
public class ImageController {

    @Autowired
    ImageService imageService;

    @PostMapping(path = "/AddImage")
    Image ajouterImage (@RequestBody Image image) {return imageService.ajouterImage(image);}


    @DeleteMapping(path = "/{id}")
    void supprimerImage(@PathVariable Long id)
    {
        imageService.supprimerImage(id);
    }

    @PutMapping(path = "/{id}")
    Image updateImage(@PathVariable Long id,@RequestBody Image image)
    {
        return imageService.updateImage(id,image);
    }

    @GetMapping(path = "/{id}")
    Optional<Image> chercherImage(@PathVariable Long id)
    {return imageService.chercherImage(id);}

    @GetMapping("/list")
    public ResponseEntity<List<Image>> getAll() {
        return new ResponseEntity<>(imageService.getAll(), HttpStatus.CREATED);
    }

}
