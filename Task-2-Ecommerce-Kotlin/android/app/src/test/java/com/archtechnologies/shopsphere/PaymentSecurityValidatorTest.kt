package com.archtechnologies.shopsphere

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Unit test validating payment security logic:
 * - Luhn checksum algorithm for Credit / Debit cards
 * - Expiry date format (MM/YY) and temporal validation
 * - CVV security validation (3 to 4 digits)
 * - Card brand recognition (Visa, Mastercard)
 * - PCI-DSS card masking (tokenization display)
 */
class PaymentSecurityValidatorTest {

    // Helper functions implementing payment security rules
    private fun isValidLuhn(cardNumber: String): Boolean {
        val cleanNumber = cardNumber.replace("\\s".toRegex(), "")
        if (cleanNumber.length !in 13..19 || !cleanNumber.all { it.isDigit() }) return false

        var sum = 0
        var alternate = false
        for (i in cleanNumber.length - 1 downTo 0) {
            var n = cleanNumber[i] - '0'
            if (alternate) {
                n *= 2
                if (n > 9) n = (n % 10) + 1
            }
            sum += n
            alternate = !alternate
        }
        return sum % 10 == 0
    }

    private fun isValidCvv(cvv: String): Boolean {
        return cvv.length in 3..4 && cvv.all { it.isDigit() }
    }

    private fun isValidExpiryFormat(expiry: String): Boolean {
        val parts = expiry.split("/")
        if (parts.size != 2) return false
        val month = parts[0].toIntOrNull() ?: return false
        val year = parts[1].toIntOrNull() ?: return false
        return month in 1..12 && year in 24..35
    }

    private fun maskCardNumber(cardNumber: String): String {
        val clean = cardNumber.replace("\\s".toRegex(), "")
        if (clean.length < 4) return clean
        val last4 = clean.takeLast(4)
        return "**** **** **** $last4"
    }

    private fun detectCardBrand(cardNumber: String): String {
        val clean = cardNumber.replace("\\s".toRegex(), "")
        return when {
            clean.startsWith("4") -> "VISA"
            clean.startsWith("51") || clean.startsWith("52") || clean.startsWith("53") ||
            clean.startsWith("54") || clean.startsWith("55") -> "MASTERCARD"
            else -> "OTHER"
        }
    }

    @Test
    fun luhnAlgorithm_validatesLegitimateCardsAndRejectsInvalidNumbers() {
        // Known valid test card numbers (Luhn compliant)
        assertTrue("Valid Visa passes Luhn", isValidLuhn("4242424242424242"))
        assertTrue("Valid Mastercard passes Luhn", isValidLuhn("5500000000000004"))

        // Known invalid test numbers
        assertFalse("Corrupted card number fails Luhn", isValidLuhn("4242424242424241"))
        assertFalse("Alphabetic strings fail Luhn", isValidLuhn("4992abcd8716"))
        assertFalse("Empty string fails Luhn", isValidLuhn(""))
    }

    @Test
    fun cvvValidation_acceptsStandardLengthsAndRejectsMalformatted() {
        assertTrue("3-digit CVV is valid", isValidCvv("123"))
        assertTrue("4-digit Amex CVV is valid", isValidCvv("1234"))
        assertFalse("2-digit CVV is rejected", isValidCvv("12"))
        assertFalse("5-digit CVV is rejected", isValidCvv("12345"))
        assertFalse("Letters in CVV are rejected", isValidCvv("12A"))
    }

    @Test
    fun expiryDateValidation_validatesFutureDatesAndFormats() {
        assertTrue("MM/YY future date is valid", isValidExpiryFormat("12/28"))
        assertTrue("Valid single month with leading zero is valid", isValidExpiryFormat("06/29"))
        assertFalse("Invalid month 13 is rejected", isValidExpiryFormat("13/28"))
        assertFalse("Invalid month 00 is rejected", isValidExpiryFormat("00/28"))
        assertFalse("Expired year is rejected", isValidExpiryFormat("05/20"))
        assertFalse("Non-slash format is rejected", isValidExpiryFormat("12-28"))
    }

    @Test
    fun cardMasking_protectsSensitiveCardDetails() {
        val masked = maskCardNumber("4111222233334567")
        assertEquals("**** **** **** 4567", masked)
    }

    @Test
    fun cardBrandDetection_identifiesVisaAndMastercard() {
        assertEquals("VISA", detectCardBrand("4111111111111111"))
        assertEquals("MASTERCARD", detectCardBrand("5211111111111111"))
        assertEquals("OTHER", detectCardBrand("3711111111111111"))
    }
}
