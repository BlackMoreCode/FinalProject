package com.kh.back.controller;

import com.kh.back.dto.PurchaseRecordDto;
import com.kh.back.entity.PurchaseRecord;
import com.kh.back.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchase")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    @PostMapping("/create")
    public PurchaseRecord createPurchaseRecord(Authentication authentication, @RequestBody PurchaseRecordDto recordDto) {
        return purchaseService.savePurchase(authentication, recordDto);
    }

}
