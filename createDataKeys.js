//run in mongosh
//mongosh --shell --nodb createDataKeys.js 
//
print("\nLoading local key configuration file...")
try {
   load( 'environment.js' );
} catch (err) {
   print("Exiting: Unable to open local config file." );
   quit()
}

var clientSideFLEOptions = {
    kmsProviders : kmsProviderId1,
    schemaMap: {},
    keyVaultNamespace: demoDB + "." + keyVaultColl
}

print("Setting up an FLE Mongo client session... \n")
var encryptedSession = new Mongo(connectStr, clientSideFLEOptions);

// Non-interactive mongo shell script equivalent of "use demoFLE"
db = encryptedSession.getDB( demoDB )

print("Getting keyVault");
var keyVault = encryptedSession.getKeyVault();

print("Creating DEK's--data encrptyion keys using 2 different CMK's");
const key1 = keyVault.createKey(provider, masterKey1, ["key1"]);
const key2 = keyVault.createKey(provider, masterKey2, ["key2"]);

print("key1 UUID: " + key1);
print("key2 UUID: " + key2);

