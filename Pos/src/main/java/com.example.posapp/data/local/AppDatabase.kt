package com.example.posapp.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.posapp.model.Product
import com.example.posapp.model.User

@Database(entities = [User::class, Product::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun productDao(): ProductDao
}

companion object {
    @Volatile
    private var INSTANCE: AppDatabase? = null

    fun getInstance(context: Context): AppDatabase {
        return INSTANCE ?: synchronized(this) {
            val instance = Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                "pos_database"
            ).build()
            INSTANCE = instance
            instance
        }
    }
}