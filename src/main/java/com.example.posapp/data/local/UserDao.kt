package com.example.posapp.data.local

import androidx.room.Dao
import androidx.room.Query
import com.example.posapp.model.User

@Dao
interface UserDao {
    @Query("SELECT * FROM user WHERE pin = :pin LIMIT 1")
    suspend fun getUserByPin(pin: String): User?
}