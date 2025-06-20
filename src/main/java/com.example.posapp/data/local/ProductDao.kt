package com.example.posapp.data.local

import androidx.room.Dao
import androidx.room.Query
import com.example.posapp.model.Product

@Dao
interface ProductDao {
    @Query("SELECT * FROM product")
    suspend fun getAllProducts(): List<Product>
}