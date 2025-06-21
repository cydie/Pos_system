package com.example.posapp.model

data class User(
    val id: String,
    val name: String,
    val pin: String,
    val role: UserRole
)