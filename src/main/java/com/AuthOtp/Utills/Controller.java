package com.AuthOtp.Utills;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/hey")
public class Controller {

    @GetMapping()
    public String seyHey() {
        return "hey";
    }

}
