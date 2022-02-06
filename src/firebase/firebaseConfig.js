import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    startAfter,
    endBefore,
    limit,
    limitToLast,
    serverTimestamp
} from 'firebase/firestore';

initializeApp({
    apiKey: 'AIzaSyAP7VK6Dd7RY_UrWabgmAhh9PmC9FqxsAs',
    authDomain: 'agriculture-test-2f536.firebaseapp.com',
    projectId: 'agriculture-test-2f536',
    storageBucket: 'agriculture-test-2f536.appspot.com',
    messagingSenderId: '597562972291',
    appId: '1:597562972291:web:46c0ce1834f3a6663b23b6'
});

const db = getFirestore();
const tractorsCollection = collection(db, 'tractors');

export const fetchTractors = async () => {
    const tractorsRef = await getDocs(tractorsCollection);
    const tractors = [];

    tractorsRef.forEach((doc) => tractors.push({id: doc.id, ...doc.data()}));

    return tractors
}

export const fetchTractor = async (tractorId) => {
    const newTractorRef = await getDoc(doc(db, 'tractors', tractorId));
    return {id: newTractorRef.id, ...newTractorRef.data()};
}

export const fetchTractorPoints = async (tractorId, document, pagesLimit, direction) => {
    const subColRef = collection(db, 'tractors', tractorId, 'points');

    const q = query(
        subColRef,
        orderBy('createdAt'),
        direction === 'next' ? startAfter(document) : endBefore(document),
        direction === 'next' ? limit(pagesLimit) : limitToLast(pagesLimit)
    );

    const tractorDataRef = await getDocs(q);

    const tractorData = [];
    tractorDataRef.forEach((doc) => tractorData.push({id: doc.id, ...doc.data()}));

    return tractorData
}

export const fetchTractorPoint = async (tractorId, pointId) => {
    const newPointRef = await getDoc(doc(db, 'tractors', tractorId, 'points', pointId));

    let newPoint = null
    if (newPointRef.data()) {
        newPoint = {id: newPointRef.id, ...newPointRef.data()};
    }

    return newPoint
}

export const updateTractor = async (tractorData) => {
    const docRef = doc(db, 'tractors', tractorData.tractorId);

    return await updateDoc(docRef, {totalWorkingHoursCounter: tractorData.totalWorkingHoursCounter});
}

export const updateTractorPoint = async (tractorData) => {
    const docRef = doc(db, 'tractors', tractorData.tractorId, 'points', tractorData.tractorPoint.id);

    return await updateDoc(docRef, tractorData.tractorPoint);
}

export const addTractor = async (tractorData) => {
    return await addDoc(tractorsCollection, tractorData);
}

export const addTractorPoints = async (tractor) => {
    await addDoc(collection(db, `tractors/${tractor.id}/points`), {createdAt: serverTimestamp(), ...tractor.points});
}

export const deleteTractor = async (tractorId) => {
    const docRef = doc(db, 'tractors', tractorId);

    return await deleteDoc(docRef)
}
