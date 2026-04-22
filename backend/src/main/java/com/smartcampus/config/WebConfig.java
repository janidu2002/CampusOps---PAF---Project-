package com.smartcampus.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Convert to absolute path for Windows compatibility
        File uploadDirFile = new File(uploadDir);
        String absolutePath = uploadDirFile.getAbsolutePath();
        
        System.out.println("Upload directory absolute path: " + absolutePath);
        
        registry.addResourceHandler("/api/files/**")
                .addResourceLocations("file:" + absolutePath + "/");
    }
}
