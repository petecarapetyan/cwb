
const firebase = require ('@firebase/rules-unit-testing')
const { test } = require('mocha')

const MY_PROJECT_ID = "fauxmazon"
const MY_UID = "user_abc"
const THEIR_UID = "user_xyz"
const MOD_UID = "user_mod"

function getStorage(auth) {
  return  firebase.initializeTestApp({  storageBucket: "default-bucket" }).storage();
}

function getAdminStorage() {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).storage();
}


beforeEach( async() => {
  // await firebase.clearFirestoreData( { projectId: MY_PROJECT_ID } )
}) 

/*
NOTE ABOUT THE STATUS OF THESE TESTS August 2021

- the storage testing with emulators has just barely emerged into development
- lotta functionality that the isn't even documented yet
- just this so far took a lot of trial and error experimentation
- things that firebase has like clear all or auth checking doesn't even exist yet for testing
- THUS: I'm going to do the minimum amount of testing only, for the moment
- can come back later and flesh out other tests when they get further into this API and documentation

*/

describe ("minimal storage tests - see notes", () => {

  it("can write at least one thing to storage", async () => {
    const storage = firebase.initializeTestApp({  storageBucket: "default-bucket" }).storage();
    const name = `${new Date().getTime()}_a_randomish_name`
    const ref = storage.ref().child(`deleteme/${name}`);
    const message = 'This is my message.';
    ref.putString(message).then((_snapshot) => {
      console.log('Uploaded a raw string!');
    });
    
    // ref.delete().then(() => {
    //   console.log(`DELETED ${name}`);
    // }).catch((error) => {
    //   console.log(`Error ${error}`);
    // });
  })

})

after( async() => {
  const storage = firebase.initializeTestApp({  storageBucket: "default-bucket" }).storage();
  const ref = storage.ref().child(`deleteme/`);
  ref().then(() => {
    console.log(`DELETED`);
  }).catch((error) => {
    console.log(`Error ${error}`);
  });
})