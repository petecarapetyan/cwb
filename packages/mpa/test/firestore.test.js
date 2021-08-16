
const assert = require ('assert')
const firebase = require ('@firebase/rules-unit-testing')
const { test } = require('mocha')

const MY_PROJECT_ID = "fauxmazon"
const MY_UID = "user_abc"
const THEIR_UID = "user_xyz"
const MOD_UID = "user_mod"
const MY_AUTH = {uid: MY_UID, email: "abc@gmail.com"}
const THEIR_AUTH = {uid: THEIR_UID, email: "xyz@gmail.com"}
const MOD_AUTH = {uid: MOD_UID, email: "mod@gmail.com", isModerator: true}
const PUBLIC_POST_ID = "public_post"
const PRIVATE_POST_ID = "private_post"

function getFirestore(auth) {
  return  firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth }).firestore();
}

function getAdminFirestore() {
  return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore()
}


beforeEach( async() => {
  await firebase.clearFirestoreData( { projectId: MY_PROJECT_ID } )
}) 

describe ("my first test", () => {

  it("can read items in readonly firestore document", async () => {
    const db = getFirestore(null)
    const testDoc = db.collection("readonly").doc("testDoc");
    await firebase.assertSucceeds(testDoc.get())
  })

  it("can read items in readonly firestore document", async () => {
    const db = getFirestore(null)
    const testDoc = db.collection("readonly").doc("testDoc");
    await firebase.assertFails(testDoc.set({foo:"bar"}))
  })

  it("can write to a document with the same userId as our user", async () => {
    const auth = MY_AUTH
    const db = getFirestore(auth)
    const testDoc = db.collection("users").doc(MY_UID);
    await firebase.assertSucceeds(testDoc.set({foo:"bar"}))
  })

  it("cannot write to a document with the different userId as our user", async () => {
    const auth = THEIR_AUTH
    const db = getFirestore(auth)
    const testDoc = db.collection("users").doc(MY_UID);
    await firebase.assertFails(testDoc.set({foo:"bar"}))
  })

  it("can read all posts marked public", async () => {
    const db = getFirestore(null)
    const testQuery = db.collection("posts").where("visibility","==", "public");
    await firebase.assertSucceeds(testQuery.get())
  })

  it("can read post written by user", async () => {
    const auth = MY_AUTH
    const db = getFirestore(auth)
    const testQuery = db.collection("posts").where("authorId","==", MY_UID);
    await firebase.assertSucceeds(testQuery.get())
  })

  it("can't read all posts", async () => {
    const auth = MY_AUTH
    const db = getFirestore(auth)
    const testQuery = db.collection("posts");
    await firebase.assertFails(testQuery.get())
  })

  it("can read a public post with other auth", async () => {
    const admin = getAdminFirestore()
    const setupDoc = admin.collection("posts").doc(PUBLIC_POST_ID)
    await setupDoc.set({authorId: THEIR_UID, visibility: "public"})
    const db = getFirestore(MY_AUTH)
    const testRead = db.collection("posts").doc(PUBLIC_POST_ID);
    await firebase.assertSucceeds(testRead.get())
  })


  it("cannot read a private post with other auth", async () => {
    const admin = getAdminFirestore()
    const setupDoc = admin.collection("posts").doc(PRIVATE_POST_ID)
    await setupDoc.set({authorId: THEIR_UID, visibility: "private"})
    const db = getFirestore(MY_AUTH)
    const testRead = db.collection("posts").doc(PRIVATE_POST_ID);
    await firebase.assertFails(testRead.get())
  })

  it("can read a private post with own auth", async () => {
    const ANOTHER = "anotherPrivatePost"
    const admin = getAdminFirestore()
    const setupDoc = admin.collection("posts").doc(ANOTHER)
    await setupDoc.set({authorId: MY_UID, visibility: "private"})
    const db = getFirestore(MY_AUTH)
    const testRead = db.collection("posts").doc(ANOTHER);
    await firebase.assertSucceeds(testRead.get())
  })


  it("allows a user to edit their own post", async () => {
    const POST_ID = "post_123";
    const admin = getAdminFirestore();
    await admin.collection("posts").doc(POST_ID).set({content: "before", authorId: MY_UID})
    const db = getFirestore(MY_AUTH)
    const testDoc = db.collection("posts").doc(POST_ID)
    await firebase.assertSucceeds(testDoc.update({content: "after"}));
  })

  it("does not allow a user to edit someone else's post", async () => {
    const POST_ID = "post_123";
    const admin = getAdminFirestore();
    await admin.collection("posts").doc(POST_ID).set({content: "before", authorId: MY_UID})
    const db = getFirestore(THEIR_AUTH)
    const testDoc = db.collection("posts").doc(POST_ID)
    await firebase.assertFails(testDoc.update({content: "after"}));
  })

  it("allows a moderator to edit their own post", async () => {
    const POST_ID = "post_123";
    const admin = getAdminFirestore();
    await admin.collection("posts").doc(POST_ID).set({content: "before", authorId: MY_UID})
    const db = getFirestore(MOD_AUTH)
    const testDoc = db.collection("posts").doc(POST_ID)
    await firebase.assertSucceeds(testDoc.update({content: "after"}));
  })

  it("allows a user to edit their own room post", async () => {
    const POST_ID = "post_123";
    const postPath = `/rooms/room_abc/posts/${POST_ID}`
    const admin = getAdminFirestore();
    await admin.doc(postPath).set({content: "before", authorId: MY_UID})
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(postPath)
    await firebase.assertSucceeds(testDoc.update({content: "after"}));
  })

  it("prevents different user to editing another's own room post", async () => {
    const POST_ID = "post_123";
    const postPath = `/rooms/room_abc/posts/${POST_ID}`
    const admin = getAdminFirestore();
    await admin.doc(postPath).set({content: "before", authorId: THEIR_UID})
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(postPath)
    await firebase.assertFails(testDoc.update({content: "after"}));
  })

  it("allows room mod to edit another's room post", async () => {
    const ROOM_PATH = "rooms/room_abc";
    const POST_PATH = `${ROOM_PATH}/posts/post_123`;
    const admin = getAdminFirestore();
    await admin.doc(ROOM_PATH).set({topic: "Unit testers", roomMods: [MY_UID, "joeblo"]});
    await admin.doc(POST_PATH).set({content: "before", authorId: THEIR_UID});
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(POST_PATH)
    await firebase.assertSucceeds(testDoc.update({content: "after"}));
  })

  it("create allowed when author listed is same as user", async () => {
    const POST_PATH = `posts/post_123`;
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(POST_PATH)
    await firebase.assertSucceeds(testDoc.set({content: "some content", authorId: MY_UID, visibility: "public", headline: "Interesting Post"}));
  })

  it("create not allowed when author listed is not same as user", async () => {
    const POST_PATH = `posts/post_123`;
    const db = getFirestore(THEIR_AUTH)
    const testDoc = db.doc(POST_PATH)
    await firebase.assertFails(testDoc.set({content: "some content", authorId: MY_UID, visibility: "public", headline: "Interesting Post"}));
  })

  it("cannot create missing some required fields", async () => {
    const POST_PATH = `posts/post_123`;
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(POST_PATH)
    await firebase.assertFails(testDoc.set({content: "Lorem Ipsum", authorId: MY_UID, headline: "Interesting Post"}));
  })

  it("can create when have required fields", async () => {
    const POST_PATH = `posts/post_123`;
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(POST_PATH)
    await firebase.assertSucceeds(testDoc.set({content: "Lorem Ipsum", authorId: MY_UID, visibility: "public", headline: "Interesting Post"}));
  })
  it("can edit a post with allowed fields", async () => {
    const POST_PATH = `posts/post_123`;
    const admin = getAdminFirestore();
    await admin.doc(POST_PATH).set({content: "before content", authorId: MY_UID, visibility: "public", headline: "before_headline"})
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(POST_PATH)
    await firebase.assertSucceeds(testDoc.update({content: "after", visibility: 'private'}));
  })

  it("cannot edit a post with unallowed fields", async () => {
    const POST_PATH = `posts/post_123`;
    const admin = getAdminFirestore();
    await admin.doc(POST_PATH).set({content: "before content", authorId: MY_UID, visibility: "public", headline: "before_headline"})
    const db = getFirestore(MY_AUTH)
    const testDoc = db.doc(POST_PATH)
    await firebase.assertFails(testDoc.update({content: "after", visibility: 'private', headline: "after_headline"}));
  })
})

after( async() => {
  await firebase.clearFirestoreData( { projectId: MY_PROJECT_ID } )
})