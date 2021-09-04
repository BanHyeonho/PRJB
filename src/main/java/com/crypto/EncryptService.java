package com.crypto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.util.CommUtil;

import oracle.net.ano.EncryptionService;

public class EncryptService {
    private static final Logger log = LoggerFactory.getLogger(EncryptionService.class);

    public EncryptService() {
    }

    public static String encrypt(String plainText) throws Throwable {
        return CommUtil.isBlank(plainText) ? plainText : AES128Encrypt.encrypt(plainText);
    }

    public static String encryptIgnoreException(String plainText) throws Throwable {
        if (alreadyEncrypt(plainText)) {
            return plainText;
        } else {
            try {
                return encrypt(plainText);
            } catch (Exception var2) {
                log.warn(var2.getMessage(), var2);
                return plainText;
            }
        }
    }

    private static boolean alreadyEncrypt(String plainText) throws Throwable {
        if (CommUtil.isBlank(plainText)) {
            return false;
        } else {
            try {
                decrypt(plainText);
                log.warn("Encryped value requested! value : {}, stacktrace : \n{}", plainText, "");
                return true;
            } catch (Exception var2) {
                return false;
            }
        }
    }

    public static String decrypt(String encrypted) throws Throwable {
        return CommUtil.isBlank(encrypted) ? encrypted : AES128Encrypt.decrypt(encrypted);
    }

    public static String decryptIgnoreException(String encrypted) throws Throwable {
        return decryptIgnoreException(encrypted, true);
    }

    public static String decryptIgnoreException(String encrypted, boolean logging) throws Throwable {
        try {
            return decrypt(encrypted);
        } catch (Exception var3) {
            if (logging) {
                log.warn(var3.getMessage(), var3);
            }

            return encrypted;
        }
    }
}
