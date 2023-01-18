package ro.tuc.ds2020.services;

import ro.tuc.ds2020.dtos.ConsumptionDTO;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.entities.Device;

import java.util.List;

public interface DeviceService {
    List<DeviceDTO> getAllDevices();

    List<DeviceDTO> getUnownedDevices();

    DeviceDTO create(DeviceDTO deviceDTO);

    ConsumptionDTO createConsumption(ConsumptionDTO consumptionDto) throws Exception;

    DeviceDTO get(Long id);

    DeviceDTO update(DeviceDTO deviceDto);

    Boolean delete(Long id);
}
