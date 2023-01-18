package ro.tuc.ds2020.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.config.JwtUtils;
import ro.tuc.ds2020.dtos.AuthDTO;
import ro.tuc.ds2020.dtos.UserDTO;
import ro.tuc.ds2020.entities.UserTable;
import ro.tuc.ds2020.repositories.UserRepository;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @PostMapping("/authenticate")
    public ResponseEntity<UserDTO> authenticate(@RequestBody AuthDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword()));

        final UserTable user = userRepository.findByName(request.getName()).get();
        //if (user != null) {
        String token = jwtUtils.generateToken(user);
        UserDTO userDTO = new UserDTO(user.getId(),user.getName(),token,user.getRole().getId());
        return ResponseEntity.ok(userDTO);
        //}
        // return ResponseEntity.status(400).body("Some error has occurred");
    }
}
