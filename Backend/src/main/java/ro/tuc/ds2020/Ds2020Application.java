package ro.tuc.ds2020;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.validation.annotation.Validated;

import java.io.IOException;

@SpringBootApplication
@Validated
public class Ds2020Application extends SpringBootServletInitializer {
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Ds2020Application.class);
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        SpringApplication.run(Ds2020Application.class, args);

//		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
//        Server server = ServerBuilder
//                .forPort(9090)
//                .addService(new AddressServiceImpl()).build();
//
//        server.start();
//        server.awaitTermination();
    }
}
