import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

const JOBS_COLL = 'jobs';
const APPS_COLL = 'applications';

export async function listJobs({ limitTo = 50, recruiterId, status } = {}) {
  const constraints = [orderBy('createdAt', 'desc'), limit(limitTo)];
  if (recruiterId) constraints.unshift(where('recruiterId', '==', recruiterId));
  if (status) constraints.unshift(where('status', '==', status));
  const q = query(collection(db, JOBS_COLL), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getJob(jobId) {
  const snap = await getDoc(doc(db, JOBS_COLL, jobId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function createJob(recruiterId, data) {
  const payload = {
    ...data,
    recruiterId,
    status: data.status || 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, JOBS_COLL), payload);
  return ref.id;
}

export async function updateJob(jobId, data) {
  await updateDoc(doc(db, JOBS_COLL, jobId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteJob(jobId) {
  await deleteDoc(doc(db, JOBS_COLL, jobId));
}

export async function listApplicationsForJob(jobId) {
  const q = query(collection(db, APPS_COLL), where('jobId', '==', jobId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function applyToJob(jobId, studentId, data = {}) {
  const payload = {
    jobId,
    studentId,
    status: 'applied',
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, APPS_COLL), payload);
  return ref.id;
}

export async function updateApplication(appId, data) {
  await updateDoc(doc(db, APPS_COLL, appId), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteApplication(appId) {
  await deleteDoc(doc(db, APPS_COLL, appId));
}

export async function listApplicationsForStudent(studentId) {
  const q = query(collection(db, APPS_COLL), where('studentId', '==', studentId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}


