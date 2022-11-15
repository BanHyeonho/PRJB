import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

public class Test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		
		StandardPBEStringEncryptor pbeEnc = new StandardPBEStringEncryptor();
        
        pbeEnc.setAlgorithm("PBEWithMD5AndDES");
        pbeEnc.setPassword("BAN921031$tomy:)");
 
//        String decrypt = pbeEnc.decrypt("RPvEGYvdptmW9vTrYDdmhK4eDMOVQJJugnTlL7veursj+mLOZowOVLspTvRbFuIyrSiinun85Mq9Qc90SSHEBw==");
//        System.out.println(decrypt);
        String encrypt = pbeEnc.encrypt("jdbc:log4jdbc:oracle:thin:@114.201.73.248:1521:PRJBDB");
        System.out.println(encrypt);
        
	}

}
