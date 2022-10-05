## Sample mongosh code to explore using multiple AWS IDs with MongoDB CSFLE 


**This Repository is NOT a supported MongoDB product**

Note: Code samples in this repository are _entirely_ for development & evaluation only.  

For complete information, please see the MongoDB [Client-Side Encryption Documentation](https://docs.mongodb.com/master/core/security-client-side-encryption/) and the multi-language [CSFLE MedCo tutorial](https://docs.mongodb.com/ecosystem/use-cases/client-side-field-level-encryption-guide/) for the latest updates and schema & security architecture guidance.

The snippets in this repository are meant to be simple copy/paste examples to get you up and running quickly to let you explore the main features of MongoDB's client-side encryption.

To use, create 2 AWS IAM users and 2 AWS KMS encryption keys. Give user1 access to both keys and
give user 2 access to key1. Then copy environment-template.js to environment.js and update the values to the
corresponding values for your MongoDB cluster and AWS environment.

Then run:
mongosh --shell --nodb createDataKeys.js
mongosh --shell --nodb people.js
mongosh --shell --nodb members.js
