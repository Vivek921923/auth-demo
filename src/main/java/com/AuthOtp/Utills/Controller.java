package com.AuthOtp.Utills;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/hey")
public class Controller {

    @GetMapping()
    public String seyHey() {
        return "hey";
    }

    @GetMapping()
    public String seyGood() {
        return "good";
    }

    @GetMapping()
    public String seybood() {
        return "bood";
    }
}
