// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";

import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    getDoc,
    doc,
    setDoc,
    QuerySnapshot,
    updateDoc
} from "firebase/firestore";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-QEERI4J13NqG8OXN7tY_1OE-ecwdx-Y",
    authDomain: "petecode-e9110.firebaseapp.com",
    projectId: "petecode-e9110",
    storageBucket: "petecode-e9110.appspot.com",
    messagingSenderId: "205737284080",
    appId: "1:205737284080:web:86865db3bdb5cd2c940d35",
    measurementId: "G-VDCGTK8H39"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
var signedIn = false;

const logInWithEmailAndPassword = async (email, password) => {
    if (email.slice(email.length - 10) == "purdue.edu") {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            window.location.reload();
        }
        catch (err) {
            console.error(err);
            alert(err.message);
        }
    }
    else {
        alert("use @purdue.edu email")
    }
};
const registerWithEmailAndPassword = async (name, email, password) => {
    if (email.slice(email.length - 10) == "purdue.edu") {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const user = res.user;
            const docRef = await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name,
                authProvider: "local",
                email,
                complete: false,
                
            });
            console.log(docRef.name)
            window.location.reload();
        }
        catch (err) {
            console.error(err);
            alert(err.message);
        }
    }
    else {
        alert("use @purdue.edu email")
    }
};

const addTime = async(time) => {
    try {
        await updateDoc(doc(db, 'users', localStorage.getItem('uid')), {
            time: time
        });
    }
    catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const problemComplete = async () => {
    try {
        await updateDoc(doc(db, 'users', localStorage.getItem('uid')), {
            complete: true
        });
    }
    catch (err) {
        console.error(err);
        alert(err.message);
    }
}

const problemIncomplete = async () => {
    try {
        await updateDoc(doc(db, 'users', localStorage.getItem('uid')), {
            complete: false
        });
    }
    catch (err) {
        console.error(err);
        alert(err.message);
    }
}


const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    }
    catch (err) {
        console.error(err);
        alert(err.message);
    }
};
const logout = () => {
    signOut(auth);
    window.location.reload();
};

const getUserUsername = async () => {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("state = definitely signed in")
            signedIn = true;
            localStorage.setItem('uid', user.uid)
        }
        else {
            console.log("state = definitely signed out")
            signedIn = false;
        }
    })
    const docRef = doc(db, 'users', localStorage.getItem('uid'))
    const docSnap = await getDoc(docRef)
    return docSnap.data().name
}

const isProblemSolved = async () => {
    const docRef = doc(db, 'users', localStorage.getItem('uid'))
    const docSnap = await getDoc(docRef)
    return docSnap.data().complete
}

const isSignedIn = () => {
    console.log(signedIn);
    return signedIn;
}

const getAllUserUsername = async () => {
    const usernameArray = []
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
        usernameArray.push(doc.data().name)
    })
    return usernameArray
}

const getAllTimes = async () => {
    var timeArray = []
    
    const querySnapshot = await getDocs(collection(db, 'users'));
    querySnapshot.forEach((doc) => {
        var key = doc.data().name;
        var val = doc.data().time;
        var doc = {key, val}
        timeArray.push(doc)
        //timeArray[index].key = doc.data().name
        //timeArray[index].value = doc.data().time
        console.log(timeArray)
    })
    return timeArray
}


export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    app,
    getUserUsername,
    getAllUserUsername,
    isSignedIn,
    signedIn,
    addTime,
    getAllTimes,
    problemComplete,
    isProblemSolved,
    problemIncomplete
};

export const firestore = firebase.firestore();