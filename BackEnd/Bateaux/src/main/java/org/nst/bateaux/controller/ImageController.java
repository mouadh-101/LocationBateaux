package org.nst.bateaux.controller;

import lombok.AllArgsConstructor;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.service.Implimentation.BateauxService;
import org.nst.bateaux.service.Implimentation.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/image")
public class ImageController {

    @Autowired
    ImageService imageService;

    @PostMapping("/upload/image")
    public ResponseEntity<ImageDto> uploadImage(@RequestParam("file") MultipartFile file) {
        return imageService.ajouterImage(file);
    }


    @DeleteMapping(path = "/{id}")
    ResponseEntity<Void> supprimerImage(@PathVariable Long id)
    {
        return imageService.deleteImage(id);
    }

    @PutMapping(path = "/{id}")
    ImageDto updateImage(@PathVariable Long id,@RequestBody ImageDto image)
    {
        return imageService.updateImage(id,image);
    }

    @GetMapping(path = "/{id}")
    ImageDto chercherImage(@PathVariable Long id)
    {return imageService.chercherImage(id);}

    @GetMapping("/list")
    public ResponseEntity<List<ImageDto>> getAll() {
        return new ResponseEntity<>(imageService.getAll(), HttpStatus.CREATED);
    }

}
