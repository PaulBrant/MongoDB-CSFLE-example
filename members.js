//make sure to run createDataKeys.js first...
//run in mongosh
//mongosh --shell --nodb members.js
//
//or inside a running mongosh
//  load('members.js');
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

print("Setting server-side json schema for automatic encryption on `members` collection...")
db.createCollection("members")
db.runCommand({
   collMod: "members",
   validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'groupId'
      ],
      encryptMetadata: {
        keyId: '/groupId'
      },
      properties: {
        groupId: {
          bsonType: 'string'
        },
        ssn: {
          encrypt: {
            bsonType: 'string',
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
          }
        },
        dob: {
          encrypt: {
            bsonType: 'date',
            algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
          }
        },
        firstName: {
          bsonType: 'string'
        },
        lastName: {
          bsonType: 'string'
        }
      }
    }
   }
});


print("Attempting to retrieve field keys...")
db = encryptedSession.getDB( demoDB )
var key1 = db.getCollection( keyVaultColl ).find({ keyAltNames: 'key1' }).toArray()[0]._id
var key2 = db.getCollection( keyVaultColl ).find({ keyAltNames: 'key2' }).toArray()[0]._id

let members = [
  {
    _id: ObjectId("632cbf61c1bdca7d4a38971c"),
    groupId: 'key1',
    ssn: '111-11-1111',
    dob: ISODate("1990-01-01T00:00:00.000Z"),
    firstName: 'John',
    lastName: 'Doe'
  },
  {
    _id: ObjectId("632cbfb8c1bdca7d4a38971d"),
    groupId: 'key1',
    ssn: '222-22-2222',
    dob: ISODate("1990-01-01T00:00:00.000Z"),
    firstName: 'Jane',
    lastName: 'Doe'
  },
  {
    _id: ObjectId("632cbfe1c1bdca7d4a38971e"),
    groupId: 'key2',
    ssn: '333-33-3333',
    dob: ISODate("1990-01-01T00:00:00.000Z"),
    firstName: 'Jim',
    lastName: 'Smith'
  }
];

let result = db.members.insertMany(members);
print("Members loaded");
