// make sure we got the all sdk
// console.log(firebase)



/* AUTH CODE */

// get auth
const auth =firebase.auth();


// get html elements
const whenSignedOut = document.getElementById('whenSignedOut')
const whenSignedIn = document.getElementById('whenSignedIn')
const signInBtn = document.getElementById('signInBtn')
const signOutBtn = document.getElementById('signOutBtn')
const userDetails = document.getElementById('userDetails')


// sign in and out logic
const provider = new firebase.auth.GoogleAuthProvider();
signInBtn.onclick = () =>auth.signInWithPopup(provider);
signOutBtn.onclick = () =>auth.signOut();


// listener callback API onAuthStateChanged to change UI
// given sign in/out state
auth.onAuthStateChanged(user => {
  if (user) {
    // sign in
    whenSignedIn.hidden = false
    whenSignedOut.hidden = true
    userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3>
    <p>User ID ${user.uid}</p>`
  } else {
    whenSignedIn.hidden = true
    whenSignedOut.hidden = false
    userDetails.innerHTML = ''
    thingsList.innerHTML =''
  }
})




/* DB CODE */

const db = firebase.firestore()

const thingsList = document.getElementById('thingsList')
const createThings = document.getElementById('createThings')

// reference to the db collection
let thingsRef;

// we're going to subscribe to a stream of data
// need to unsubscribe
// you need to avoid memory leak, or avoid to keep listener open
let unsubscribe;


auth.onAuthStateChanged(user => {

  if (user) {
    thingsRef = db.collection('things');
    createThings.onclick = () => {
      const { serverTimestamp } = firebase.firestore.FieldValue;
      thingsRef.add({
        uid: user.uid,
        name:faker.commerce.productName(),
        createdAt:serverTimestamp()
      })
    }

    unsubscribe =thingsRef
      // for this user
      .where('uid', '==', user.uid)
      .orderBy('createdAt')
      // get current db snapshot
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map( doc => {
          return `<li> ${ doc.data().name } </li>`
        });

        thingsList.innerHTML = items.join('');
      })


  } else{
    unsubscribe && unsubscribe()
  }

})


