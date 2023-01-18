package ro.tuc.ds2020.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.ConsumptionDTO;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.services.DeviceService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/device")
@RequiredArgsConstructor
@CrossOrigin
public class DeviceController {
    private final DeviceService deviceService;

    @GetMapping("/getAll")
    public ResponseEntity<List<DeviceDTO>> getAllDevices(){
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @GetMapping("/getUnowned")
    public ResponseEntity<List<DeviceDTO>> getUnownedDevices(){
        return ResponseEntity.ok(deviceService.getUnownedDevices());
    }
    @PostMapping("/create")
    public ResponseEntity<DeviceDTO> save(@RequestBody @Valid DeviceDTO deviceDTO){
        return ResponseEntity.ok(deviceService.create(deviceDTO));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<DeviceDTO> get(@PathVariable("id") Long id){
        return ResponseEntity.ok(deviceService.get(id));
    }

    @PutMapping("/update")
    public ResponseEntity<DeviceDTO> update(@RequestBody DeviceDTO deviceDto){
        System.out.println(deviceDto);
        return ResponseEntity.ok(deviceService.update(deviceDto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> delete(@PathVariable("id") Long id){
        return ResponseEntity.ok(deviceService.delete(id));
    }

    @PostMapping("/createConsumption")
    public ResponseEntity<ConsumptionDTO> saveConsumption(@RequestBody @Valid ConsumptionDTO consumptionDto){
        try{
            System.out.println(consumptionDto);
            return ResponseEntity.ok(deviceService.createConsumption(consumptionDto));
        }catch(Exception e){
            System.out.println(e.toString());
            return ResponseEntity.ok(new ConsumptionDTO());
        }
    }
}
