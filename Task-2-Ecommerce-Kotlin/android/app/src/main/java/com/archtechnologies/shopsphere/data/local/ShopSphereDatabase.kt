package com.archtechnologies.shopsphere.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.archtechnologies.shopsphere.data.local.dao.CartDao
import com.archtechnologies.shopsphere.data.local.dao.ProductDao
import com.archtechnologies.shopsphere.data.local.entity.CartEntity
import com.archtechnologies.shopsphere.data.local.entity.ProductEntity

@Database(
    entities = [CartEntity::class, ProductEntity::class],
    version = 1,
    exportSchema = false
)
abstract class ShopSphereDatabase : RoomDatabase() {
    abstract fun cartDao(): CartDao
    abstract fun productDao(): ProductDao

    companion object {
        @Volatile
        private var INSTANCE: ShopSphereDatabase? = null

        fun getDatabase(context: Context): ShopSphereDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ShopSphereDatabase::class.java,
                    "shopsphere_database"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
