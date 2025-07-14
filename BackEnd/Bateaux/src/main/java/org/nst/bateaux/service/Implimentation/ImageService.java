package org.nst.bateaux.service.Implimentation;

import lombok.AllArgsConstructor;
import org.nst.bateaux.config.BusinessException;
import org.nst.bateaux.dto.bateau.ImageDto;
import org.nst.bateaux.entity.Bateaux;
import org.nst.bateaux.entity.Image;
import org.nst.bateaux.repository.ImageRepository;
import org.nst.bateaux.service.Interface.IBateauxService;
import org.nst.bateaux.service.Interface.IImageService;
import org.nst.bateaux.service.mappers.MapToDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ImageService  implements IImageService {

    @Autowired
    ImageRepository imageRepository ;
    @Autowired
    MapToDto mapToDto;
    @Override
    public ResponseEntity<ImageDto> ajouterImage(MultipartFile file)
    {

        try {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/", filename);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            String fileUrl = "http://localhost:8081/uploads/" + filename;

            Image image = new Image();
            image.setUrl(fileUrl);
            image.setBateau(null);



            return ResponseEntity.ok(mapToDto.mapToImageDto(imageRepository.save(image)));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @Override
    public ResponseEntity<Void> deleteImage(Long id) {
        Optional<Image> optionalImage = imageRepository.findById(id);
        if (optionalImage.isPresent()) {
            Image image = optionalImage.get();

            String filename = image.getUrl().substring(image.getUrl().lastIndexOf("/") + 1);
            Path path = Paths.get("uploads", filename);
            try {
                Files.deleteIfExists(path);
            } catch (IOException ignored) {
            }

            imageRepository.delete(image);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ImageDto updateImage(Long id,ImageDto image)
    {
        Image i=imageRepository.findById(id).orElse(null);
        i.setUrl(image.getUrl());
        return mapToDto.mapToImageDto(imageRepository.save(i));
    }

    @Override
    public ImageDto chercherImage(Long id)
    {
        return mapToDto.mapToImageDto(imageRepository.findById(id).orElseThrow(() -> new BusinessException("Image Not Found")));
    }

    @Override
    public List<ImageDto> getAll() {
        List<ImageDto> list = new ArrayList<>();
        for (Image i : imageRepository.findAll())
        {
            list.add(mapToDto.mapToImageDto(i));
        }
        return list;
    }
}
