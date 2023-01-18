package ro.tuc.ds2020.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.tuc.ds2020.entities.Device;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDTO {

    private Long id;
    private String name;
    private String description;
    private String address;
    private String maxConsumption;
    private Long user_id;

    public DeviceDTO convertEntityToDto(Device device)
    {
        return new DeviceDTO(
          device.getId(),
          device.getName(),
          device.getDescription(),
          device.getAddress(),
          device.getMaxConsumption(),
          device.getUserTable() == null? null: device.getUserTable().getId()
        );
    }

}
