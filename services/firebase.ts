
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, onValue, update } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBU7dBLWNCaTQQdxl0vCKNFRkS8sDC2o6I",
  authDomain: "ep-stem-academy.firebaseapp.com",
  databaseURL: "https://ep-stem-academy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ep-stem-academy",
  storageBucket: "ep-stem-academy.firebasestorage.app",
  messagingSenderId: "974275103816",
  appId: "1:974275103816:web:05308b9b1c62bec6f45c7d",
  measurementId: "G-W04WTBE5KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 */
export const uploadFile = async (file: File | Blob, path: string): Promise<string> => {
  const fileRef = storageRef(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

/**
 * Base64 string to Blob helper for convenience
 */
export const base64ToBlob = (base64: string, contentType = ''): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};
