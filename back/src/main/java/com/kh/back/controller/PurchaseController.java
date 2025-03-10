package com.kh.back.controller;

import com.kh.back.dto.PurchaseRecordDto;
import com.kh.back.entity.PurchaseRecord;
import com.kh.back.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping("/create")
    public PurchaseRecord createPurchaseRecord(Authentication authentication, @RequestBody PurchaseRecordDto recordDto) {
        return purchaseService.savePurchase(authentication, recordDto);
    }

    @GetMapping("/check")
    public boolean checkMemberPurchase(Authentication authentication) {
        return purchaseService.isMemberPurchase(authentication);
    }

}
