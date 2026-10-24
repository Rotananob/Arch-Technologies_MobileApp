package com.archtechnologies.shopsphere.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.archtechnologies.shopsphere.data.local.entity.CartEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CartDao {
    @Query("SELECT * FROM cart_items")
    fun getAllCartItems(): Flow<List<CartEntity>>

    @Query("SELECT * FROM cart_items WHERE productId = :productId LIMIT 1")
    suspend fun getCartItemByProduct(productId: String): CartEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(item: CartEntity)

    @Update
    suspend fun update(item: CartEntity)

    @Query("DELETE FROM cart_items WHERE id = :itemId")
    suspend fun deleteById(itemId: String)

    @Query("DELETE FROM cart_items")
    suspend fun clearCart()
}
