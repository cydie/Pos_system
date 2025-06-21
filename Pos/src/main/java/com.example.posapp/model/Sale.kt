package com.example.posapp.model

data class Sale(
    val id: String,
    val branchId: String,
    val items: List<SaleItem>,
    val total: Double,
    val timestamp: Long
)

data class SaleItem(
    val productId: String,
    val quantity: Int,
    val price: Double
)