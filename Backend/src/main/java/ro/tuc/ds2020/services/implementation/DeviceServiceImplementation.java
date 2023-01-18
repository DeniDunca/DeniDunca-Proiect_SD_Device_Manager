package ro.tuc.ds2020.services.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.dtos.ConsumptionDTO;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.entities.Consumption;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.ConsumptionRepository;
import ro.tuc.ds2020.repositories.DeviceRepository;
import ro.tuc.ds2020.repositories.UserRepository;
import ro.tuc.ds2020.services.DeviceService;

import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Boolean.TRUE;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class DeviceServiceImplementation implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final ConsumptionRepository consumptionRepository;


    @Override
    public List<DeviceDTO> getAllDevices() {
        log.info("Getting all devices");
        List<Device> devices = deviceRepository.findAll();
        List<DeviceDTO> deviceDTO = new ArrayList<>();
        devices.forEach(device -> deviceDTO.add(new DeviceDTO().convertEntityToDto(device)));
        return deviceDTO;
    }

    @Override
    public List<DeviceDTO> getUnownedDevices() {
        log.info("Getting devices with no owner :(");
        List<Device> devices = deviceRepository.findAll();
        List<DeviceDTO> deviceDTO = new ArrayList<>();

        devices = devices.stream()
                        .filter(device -> device.getUserTable() == null)
                        .collect(Collectors.toList());

        devices.forEach(device -> deviceDTO.add(new DeviceDTO().convertEntityToDto(device)));
        return deviceDTO;
    }

    @Override
    public DeviceDTO create(DeviceDTO deviceDTO) {
        Device device = new Device();
        device.setName(deviceDTO.getName());
        device.setDescription(deviceDTO.getDescription());
        device.setAddress(deviceDTO.getAddress());
        device.setMaxConsumption(deviceDTO.getMaxConsumption());
        //device.setUserTable(null);
        return new DeviceDTO().convertEntityToDto(deviceRepository.save(device));
    }

    @Override
    public ConsumptionDTO createConsumption(ConsumptionDTO consumptionDto) throws Exception {
        Consumption consumption = new Consumption();
        consumption.setDate(consumptionDto.getDate());
        consumption.setHour(consumptionDto.getHour());
        consumption.setEnergyConsumption(consumptionDto.getEnergyConsumption());
        consumption.setDevice(deviceRepository.findById(consumptionDto.getDeviceId()).get());

        return new ConsumptionDTO().convertEntityToDto(consumptionRepository.save(consumption));

    }
    @Override
    public DeviceDTO get(Long id) {
        return new DeviceDTO().convertEntityToDto(deviceRepository.findById(id).get());
    }

    @Override
    public DeviceDTO update(DeviceDTO deviceDto) {
        Device updatedDevice = deviceRepository.findById(deviceDto.getId()).get();
        updatedDevice.setName(deviceDto.getName());
        updatedDevice.setDescription(deviceDto.getDescription());
        updatedDevice.setAddress(deviceDto.getAddress());
        updatedDevice.setMaxConsumption(deviceDto.getMaxConsumption());

        if(deviceDto.getUser_id() == null){
            updatedDevice.setUserTable(null);
        } else {
            updatedDevice.setUserTable(userRepository.findById(deviceDto.getUser_id()).get());
        }
        return new DeviceDTO().convertEntityToDto(deviceRepository.save(updatedDevice));
    }

    @Override
    public Boolean delete(Long id) {
        deviceRepository.deleteById(id);
        return TRUE;
    }
}
