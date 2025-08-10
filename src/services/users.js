import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

const USERS_COLL = 'users';

export async function getUser(uid) {
  const snap = await getDoc(doc(db, USERS_COLL, uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function listUsersByRole(role) {
  const q = query(collection(db, USERS_COLL), where('role', '==', role));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateUser(uid, data) {
  await updateDoc(doc(db, USERS_COLL, uid), data);
}

export async function ensureUser(uid, data) {
  await setDoc(doc(db, USERS_COLL, uid), data, { merge: true });
}


