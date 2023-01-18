package ro.tuc.ds2020.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import ro.tuc.ds2020.dtos.*;
import ro.tuc.ds2020.entities.Consumption;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.entities.Role;
import ro.tuc.ds2020.entities.UserTable;
import ro.tuc.ds2020.repositories.ConsumptionRepository;
import ro.tuc.ds2020.repositories.RoleRepository;
import ro.tuc.ds2020.repositories.UserRepository;
import ro.tuc.ds2020.services.UserService;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import static java.lang.Boolean.TRUE;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class UserServiceImplementation implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ConsumptionRepository consumptionRepository;
    private final SimpMessagingTemplate template;

    @Override
    public List<DeviceDTO> getUserDevices(Long id) {
        List<Device> devices = userRepository.findById(id).get().getDevices();

        List<DeviceDTO> deviceDTO = new ArrayList<>();
        devices.forEach(device -> deviceDTO.add(new DeviceDTO().convertEntityToDto(device)));

        return deviceDTO;
    }

    @Override
    public List<UserDTO> getAll() {
        List<UserTable> userTables = userRepository.findAll();
        List<UserDTO> userDTO = new ArrayList<>();

        userTables.forEach(
                user -> userDTO.add(new UserDTO().convertEntityToDto(user))
        );
        return userDTO;
    }

    @Override
    public UserDTO create(UserDTO userDTO) throws Exception {
        if (userRepository.findByName(userDTO.getName()).isPresent()) {
            throw new Exception("Name already taken");
        }

        UserTable userTable = new UserTable();
        userTable.setName(userDTO.getName());
        userTable.setPassword(userDTO.getPassword());
        userTable.setRole(roleRepository.getById(userDTO.getRole()));
        return new UserDTO().convertEntityToDto(userRepository.save(userTable));
    }

    @Override
    public RoleDTO createRole(RoleDTO roleDto) throws Exception {
        Role role = new Role();
        role.setName(roleDto.getName());
        return new RoleDTO().convertEntityToDto(roleRepository.save(role));
    }

    @Override
    public UserDTO get(Long id) {
        return new UserDTO().convertEntityToDto(userRepository.findById(id).get());
    }

    @Override
    public UserDTO update(UserDTO userDto) {
        UserTable updatedUser = userRepository.findById(userDto.getId()).get();
        updatedUser.setId(userDto.getId());
        updatedUser.setName(userDto.getName());
        updatedUser.setPassword(userDto.getPassword());
        updatedUser.setRole(roleRepository.findById(userDto.getRole()).get());
        return new UserDTO().convertEntityToDto(userRepository.save(updatedUser));
    }

    @Override
    public Boolean delete(Long id) {
        userRepository.deleteById(id);
        return TRUE;
    }

    @Override
    public UserDTO findByNameAndPassword(String name, String password) {
        return new UserDTO().convertEntityToDto(userRepository.findByNameAndPassword(name, password));
    }

    @Override
    public List<ConsumptionDTO> getConsumption(Long id, LocalDate date) {
        List<ConsumptionDTO> consumptionDTOS = new ArrayList<>();
        List<Device> devices = userRepository.findById(id).get().getDevices();

        for(Device device : devices){
            Optional<List<Consumption>> tempConsumption = consumptionRepository.getByDevice(device);
            if(tempConsumption.isPresent()){
                for(Consumption consumption : tempConsumption.get()){
                    if(consumption.getDate().equals(date)){
                        consumptionDTOS.add(new ConsumptionDTO().convertEntityToDto(consumption));
                    }
                }
            }
        }

        return consumptionDTOS;
    }

    @Override
    public void callWebsocket(MessageDTO messageDTO){
        // sent TO admin
        if(messageDTO.getTo() == 1){
            template.convertAndSend("/notification/socket/api/chat/1", messageDTO);
        }
        // sent TO user
        else {
            template.convertAndSend("/notification/socket/api/chat/" + messageDTO.getTo() , messageDTO);
        }
    }

    @Override
    public void callMessageReadWebsocket(MessageDTO messageDTO) {
        // sent TO admin
        if(messageDTO.getTo() == 1){
            template.convertAndSend("/notification/socket/api/seen/1", messageDTO);
        }
        // sent TO user
        else {
            template.convertAndSend("/notification/socket/api/seen/" + messageDTO.getTo() , messageDTO);
        }
    }

    @Override
    public void callUserTypingWebsocket(MessageDTO messageDTO) {
        // sent TO admin
        if(messageDTO.getTo() == 1){
            template.convertAndSend("/notification/socket/api/typing/1", messageDTO.getText());
        }
        // sent TO user
        else {
            template.convertAndSend("/notification/socket/api/typing/" + messageDTO.getTo() , messageDTO.getText());
        }
    }
}