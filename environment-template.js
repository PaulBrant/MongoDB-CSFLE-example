//Copy this file to environment.js and update values

var demoDB = "awsFLE"
var keyVaultColl = "__keystore"  // nothing special about this key vault collection name, but make it stand out

const provider = "aws";
//AWS user with access to all AWS KMS keys used in example
const kmsProviderId1 = {
  aws: {
    accessKeyId: "XXXXXXX",
    secretAccessKey: "YYYYYYYYYYYYY",
  },
};

//AWS user that only has access to AWS KMS key1
const kmsProviderId2 = {
  aws: {
    accessKeyId: "AAAAAAAA",
    secretAccessKey: "BBBBBBBBBBB",
  },
};

//Identifiers for AWS KMS Customer Master Keys (CMK)
const masterKey1 = {
    key: "arn:aws:kms:us-east-2:999999999999:key/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    region: "us-east-2",
};
const masterKey2 = {
    key: "arn:aws:kms:us-east-2:111111111111:key/aaaaaaaa-bbbb-cccc-dddd-111111111111",
    region: "us-east-2",
};

//connection string for MongoDB cluster
const connectStr = "mongodb+srv://userid:password@mycluster.mongodb.net/test?retryWrites=true&w=majority"

