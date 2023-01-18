package ro.tuc.ds2020.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.*;
import ro.tuc.ds2020.services.UserService;

import javax.validation.Valid;
import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {
    private final UserService userService;
    List<MessageDTO> messages = new ArrayList<>();

    @GetMapping("devices/{id}")
    public ResponseEntity<List<DeviceDTO>> getUserDevices(@PathVariable("id") Long id){
        return ResponseEntity.ok(userService.getUserDevices(id));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        return ResponseEntity.ok(userService.getAll());
    }

    @PostMapping("/create")
    public ResponseEntity<UserDTO> save(@RequestBody @Valid UserDTO userDTO){
        try{
            return ResponseEntity.ok(userService.create(userDTO));
        }catch(Exception e){
            System.out.println(e.toString());
            return ResponseEntity.ok(new UserDTO());
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<UserDTO> get(@PathVariable("id") Long id){
        return ResponseEntity.ok(userService.get(id));
    }

    @PutMapping("/update")
    public ResponseEntity<UserDTO> update(@RequestBody UserDTO userDto){
        return ResponseEntity.ok(userService.update(userDto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") Long id){
        return ResponseEntity.ok(userService.delete(id));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(userService.findByNameAndPassword(authDTO.getName(), authDTO.getPassword()));
    }

    @GetMapping("/consumption/{id}/{date}")
    public ResponseEntity<List<ConsumptionDTO>> getConsumption(@PathVariable("id") Long id,@PathVariable("date") Date date ){
        LocalDate localDate = date.toLocalDate();
        System.out.println(id + " " + date);
        return ResponseEntity.ok(userService.getConsumption(id, localDate));
    }

    @PostMapping("/createRole")
    public ResponseEntity<RoleDTO> saveRole(@RequestBody @Valid RoleDTO roleDto){
        try{
            return ResponseEntity.ok(userService.createRole(roleDto));
        }catch(Exception e){
            System.out.println(e.toString());
            return ResponseEntity.ok(new RoleDTO());
        }
    }

    @PostMapping("/message")
    public ResponseEntity<MessageDTO> saveUserMessage(@RequestBody MessageDTO messageDTO){
        //add message to list
        messages.add(messageDTO);

        //send notification to admin/user about message
        userService.callWebsocket(messageDTO);

        System.out.println(messages);
        return ResponseEntity.ok(messageDTO);
    }

    @GetMapping("/getMessages")
    public ResponseEntity<List<MessageDTO>> getMessages(){
        return ResponseEntity.ok(messages);
    }


    @GetMapping("/getMessages/{id}")
    public ResponseEntity<List<MessageDTO>> getMessagesFromAdmin(@PathVariable("id") Long id){
        List<MessageDTO> messagesForUser = new ArrayList<>();
        for(MessageDTO message: messages){
            if((message.getFrom() == 1 && message.getTo() == id) || (message.getFrom() == id)){
                messagesForUser.add(message);
            }
        }
        return ResponseEntity.ok(messagesForUser);
    }

    @GetMapping("/getMessagesFromUser/{id}")
    public ResponseEntity<List<MessageDTO>> getMessagesFromUser(@PathVariable("id") Long id){
        List<MessageDTO> messagesForUser = new ArrayList<>();
        for(MessageDTO message: messages){
            if((message.getFrom() == 1 && message.getTo() == id) ||
                    (message.getFrom() == id && message.getTo() == 1)){
                messagesForUser.add(message);
            }
        }
        return ResponseEntity.ok(messagesForUser);
    }

    @PostMapping("/messageRead")
    public ResponseEntity<String> messageRead(@RequestBody MessageDTO messageDTO){
        userService.callMessageReadWebsocket(messageDTO);
        return ResponseEntity.ok("Message read");
    }

    @PostMapping("/typing")
    public ResponseEntity<String> userTyping(@RequestBody MessageDTO messageDTO){
        userService.callUserTypingWebsocket(messageDTO);
        return ResponseEntity.ok("OK");
    }
}
