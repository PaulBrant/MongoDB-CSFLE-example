//make sure to run members.js first...
//run in mongosh
//mongosh --shell --nodb readMembers.js
//
//or inside a running mongosh
//  load('readMembers.js');
//

//encryptedSession is already set if createDataKeys was run in mongosh already
if (encryptedSession == null) {
    print("\nLoading local key configuration file...")
    try {
        load( 'environment.js' );
        var clientSideFLEOptions = {
            kmsProviders : kmsProviderId1,
            schemaMap: {},
            keyVaultNamespace: demoDB + "." + keyVaultColl
        }
        var encryptedSession = new Mongo(connectStr, clientSideFLEOptions);
    } catch (err) {
        print("Exiting: Unable to get connected." );
        quit()
    }
}

let unencryptedSession = Mongo(connectStr);
db = unencryptedSession.getDB(demoDB);

print("reading members without any key credentials");
let mem = db.members.find()
while (mem.hasNext()) {
  printjson(mem.next());
}

print("reading members with key credentials having access to all keys");
db = encryptedSession.getDB(demoDB);
mem = db.members.find();
while (mem.hasNext()) {
  printjson(mem.next());
}

print("reading members with key credentials no access to key2");

var clientSideFLEOptions = {
  kmsProviders : kmsProviderId2,
  schemaMap: {},
  keyVaultNamespace: demoDB + "." + keyVaultColl
}
var encryptedSession2 = new Mongo(connectStr, clientSideFLEOptions);
db = encryptedSession2.getDB(demoDB);

print("Read only data which key2 can access");
print("Should print out the records from group key1");
mem = db.members.find({groupId: 'key1'});
while (mem.hasNext()) {
  printjson(mem.next());
}

print("Try to read all data with key2");
print("error is expected because all data can't be decrypted...");
mem = db.members.find();
while (mem.hasNext()) {
  printjson(mem.next());
}
