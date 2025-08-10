import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from '../firebase';

const NOTIFS_COLL = 'notifications';

export async function listNotificationsForUser(userId, limitTo = 50) {
  const q = query(
    collection(db, NOTIFS_COLL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createNotification({ userId, title, body, data = {} }) {
  await addDoc(collection(db, NOTIFS_COLL), {
    userId,
    title,
    body,
    data,
    createdAt: serverTimestamp(),
  });
}


