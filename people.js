//make sure to run createDataKeys.js first...
//run in mongosh
//mongosh --shell --nodb people.js 
//
//or inside running shell...
// load('people.js');

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

print("Attempting to retrieve field keys...")
db = encryptedSession.getDB( demoDB )
var key1 = db.getCollection( keyVaultColl ).find({ keyAltNames: 'key1' }).toArray()[0]._id
var key2 = db.getCollection( keyVaultColl ).find({ keyAltNames: 'key2' }).toArray()[0]._id

print("Setting server-side json schema for automatic encryption on `people` collection...")
db.createCollection("people")
db.runCommand({
   collMod: "people",
   validator: {
    $jsonSchema: {
        bsonType: 'object',
        properties: {
          key1Fields: {
            bsonType: 'object',
            encryptMetadata: {
              keyId: [key1]
            },
            properties: {
              ssn: {
                encrypt: {
                  bsonType: 'string',
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
                }
              }
            }
          },
          key2Fields: {
            bsonType: 'object',
            encryptMetadata: {
              keyId: [key2]
            },
            properties: {
              dob: {
                encrypt: {
                  bsonType: 'date',
                  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
                }
              }
            }
          }
        }
      }
   }
});

let people = [
    { 
      firstName: 'Mel',
      key1Fields: { ssn: '111-11-1111' },
      key2Fields: { dob: ISODate('1983-04-10') }
    },
    { 
      firstName: 'Paul',
      key1Fields: { ssn: '222-22-2222' },
      key2Fields: { dob: ISODate('1980-03-01') }
    }
];

let result = db.people.insertMany(people);
print("People loaded");
