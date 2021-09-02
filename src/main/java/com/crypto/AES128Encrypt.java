package com.crypto;

import java.io.UnsupportedEncodingException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import com.util.CommUtil;

final class AES128Encrypt {
    private static final Logger log = LoggerFactory.getLogger(AES128Encrypt.class);
    private static final String ALGORITHM_AES = "AES";
    private static final String CHARACTER_ENCODING = "UTF-8";
    private static final String CIPHER_TRANSFORMATION = "AES/CBC/PKCS5Padding";
//    private static final String key = "8Z9o5E2d1QacPa0e";
    private static final String key = "BAN921031$tomy";
    private static final byte[] keyBytes = new byte[16];
    private static final String CIPHER_KEY_ENC = "AES128Encrypt_chiper_enc";
    private static final String CIPHER_KEY_DEC = "AES128Encrypt_chiper_dec";
    private static SecretKeySpec secretKeySpec;
    private static IvParameterSpec ivParameterSpec;

    AES128Encrypt() {
    	
    }

    protected static String encrypt(String plainText) throws Throwable {
        try {
            if (CommUtil.isBlank(plainText)) {
                return plainText;
            } else {
                byte[] plainTextbytes = plainText.getBytes(CHARACTER_ENCODING);
                return byteArrayToHex(encrypt(plainTextbytes));
            }
        } catch (UnsupportedEncodingException var2) {
            throw var2;
        }
    }

    private static byte[] encrypt(byte[] plainText) throws Throwable {
        return getCipherInstance(1).doFinal(plainText);
    }

    private static String byteArrayToHex(byte[] ba) {
        StringBuffer sb = new StringBuffer(ba.length * 2);
        byte[] var2 = ba;
        int var3 = ba.length;

        for(int var4 = 0; var4 < var3; ++var4) {
            byte b = var2[var4];
            String hexNumber = "0" + Integer.toHexString(255 & b);
            sb.append(hexNumber.substring(hexNumber.length() - 2));
        }

        return sb.toString();
    }

    private static Cipher getCipherInstance(int opMode) throws Throwable {
        String key = 1 == opMode ? CIPHER_KEY_ENC : CIPHER_KEY_DEC;
        return createCipherInstance(opMode);
//        return (Cipher)ThreadLocalContextHandler.getOrDefaultAndPut(key, () -> {
//            try {
//				return createCipherInstance(opMode);
//			} catch (Throwable e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			return null;
//        });
    }

    private static Cipher createCipherInstance(int opMode) throws Throwable {
        try {
            Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
            cipher.init(opMode, secretKeySpec, ivParameterSpec);
            return cipher;
        } catch (Throwable var2) {
            throw var2;
        }
    }

    protected static String decrypt(String encryptedText) throws Throwable {
        try {
            if (CommUtil.isBlank(encryptedText)) {
                return encryptedText;
            } else {
                byte[] cipheredBytes = hexToByteArray(encryptedText);
                String decrypted = new String(decrypt(cipheredBytes), CHARACTER_ENCODING);
                if (StringUtils.isEmpty(decrypted)) {
                    throw new BadPaddingException("Decrype result is empty!");
                } else {
                    return decrypted;
                }
            }
        } catch (UnsupportedEncodingException var3) {
            throw var3;
        }
    }

    private static byte[] decrypt(byte[] cipherText) throws Throwable {
        return getCipherInstance(2).doFinal(cipherText);
    }

    private static byte[] hexToByteArray(String hex) {
        byte[] ba = new byte[hex.length() / 2];

        for(int i = 0; i < ba.length; ++i) {
            ba[i] = (byte)Integer.parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }

        return ba;
    }

    static {
        try {
            byte[] parameterKeyBytes = key.getBytes(CHARACTER_ENCODING);
            System.arraycopy(parameterKeyBytes, 0, keyBytes, 0, Math.min(parameterKeyBytes.length, keyBytes.length));
            secretKeySpec = new SecretKeySpec(keyBytes, ALGORITHM_AES);
            ivParameterSpec = new IvParameterSpec(keyBytes);
        } catch (Exception var1) {
            log.error(var1.getMessage(), var1);
        }

    }
}
