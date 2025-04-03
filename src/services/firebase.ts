
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  onSnapshot,
  query,
  where,
  serverTimestamp,
  increment,
  getDoc,
  setDoc,
  deleteDoc,
  orderBy
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1iQ2GOyWvnoWLk6yLyh-sUZFrHeMMJyE",
  authDomain: "recipeapp-7fd70.firebaseapp.com",
  projectId: "recipeapp-7fd70",
  storageBucket: "recipeapp-7fd70.firebasestorage.app",
  messagingSenderId: "637982951148",
  appId: "1:637982951148:web:1ca2838e7b9e020063c7c9",
  measurementId: "G-1CX3D518DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Auth functions
export const loginWithEmail = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in with email and password", error);
    throw error;
  }
};

export const registerWithEmail = async (email: string, password: string) => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error registering with email and password", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

// Recipe functions
export const addRecipe = async (recipe: {
  title: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
}) => {
  try {
    const user = auth.currentUser;
    const recipeWithUser = {
      ...recipe,
      userId: user?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, "recipes"), recipeWithUser);
    
    // Increment recipe count in stats
    await incrementRecipeCount();
    
    return docRef;
  } catch (error) {
    console.error("Error adding recipe", error);
    throw error;
  }
};

export const updateRecipe = async (
  recipeId: string, 
  updates: {
    title?: string;
    ingredients?: string[];
    steps?: string[];
    tags?: string[];
  }
) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    
    // Check if user is the creator of the recipe
    const recipeRef = doc(db, "recipes", recipeId);
    const recipeSnap = await getDoc(recipeRef);
    
    if (!recipeSnap.exists()) throw new Error("Recipe not found");
    
    const recipeData = recipeSnap.data();
    if (recipeData.userId !== user.uid) throw new Error("Not authorized to edit this recipe");
    
    // Update recipe
    await updateDoc(recipeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating recipe", error);
    throw error;
  }
};

export const deleteRecipe = async (recipeId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    
    // Check if user is the creator of the recipe
    const recipeRef = doc(db, "recipes", recipeId);
    const recipeSnap = await getDoc(recipeRef);
    
    if (!recipeSnap.exists()) throw new Error("Recipe not found");
    
    const recipeData = recipeSnap.data();
    if (recipeData.userId !== user.uid) throw new Error("Not authorized to delete this recipe");
    
    // Delete recipe
    await deleteDoc(recipeRef);
    
    // Decrement recipe count in stats
    await decrementRecipeCount();
    
    return true;
  } catch (error) {
    console.error("Error deleting recipe", error);
    throw error;
  }
};

export const getRecipes = async (sortBy = "createdAt", sortOrder = "desc") => {
  try {
    const q = query(
      collection(db, "recipes"), 
      orderBy(sortBy, sortOrder === "desc" ? "desc" : "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const recipes: any[] = [];
    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });
    return recipes;
  } catch (error) {
    console.error("Error getting recipes", error);
    throw error;
  }
};

export const searchRecipesByIngredients = async (ingredients: string[]) => {
  try {
    // Get all recipes and filter by ingredients
    const recipes = await getRecipes();
    return recipes.filter(recipe => {
      if (!recipe.ingredients) return false;
      
      // Calculate the match percentage between search ingredients and recipe ingredients
      const matchCount = ingredients.filter(ingredient => 
        recipe.ingredients.some((recipeIngredient: string) => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      ).length;
      
      // We want at least 90% match
      return matchCount / ingredients.length >= 0.9;
    });
  } catch (error) {
    console.error("Error searching recipes", error);
    throw error;
  }
};

export const filterRecipesByTag = async (tag: string) => {
  try {
    const q = query(collection(db, "recipes"), where("tags", "array-contains", tag));
    const querySnapshot = await getDocs(q);
    
    const recipes: any[] = [];
    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });
    
    return recipes;
  } catch (error) {
    console.error("Error filtering recipes by tag", error);
    throw error;
  }
};

// Favorites functions
export const addToFavorites = async (recipeId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    
    const userRef = doc(db, "users", user.uid);
    
    // Check if user doc exists first
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        email: user.email,
        favorites: [recipeId],
        createdAt: serverTimestamp(),
      });
    } else {
      // Update existing document
      await updateDoc(userRef, {
        favorites: arrayUnion(recipeId)
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error adding to favorites", error);
    throw error;
  }
};

export const removeFromFavorites = async (recipeId: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      favorites: arrayRemove(recipeId)
    });
    
    return true;
  } catch (error) {
    console.error("Error removing from favorites", error);
    throw error;
  }
};

export const getFavorites = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) return [];
    
    const userData = userDoc.data();
    const favoriteIds = userData.favorites || [];
    
    if (favoriteIds.length === 0) return [];
    
    // Get the actual recipe documents
    const recipes: any[] = [];
    const allRecipes = await getRecipes();
    
    return allRecipes.filter(recipe => favoriteIds.includes(recipe.id));
  } catch (error) {
    console.error("Error getting favorites", error);
    throw error;
  }
};

// Stats functions
export const incrementSearchCount = async () => {
  try {
    const statsRef = doc(db, "stats", "searches");
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      await setDoc(statsRef, { count: 1 });
    } else {
      await updateDoc(statsRef, {
        count: increment(1)
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error incrementing search count", error);
    throw error;
  }
};

export const incrementRecipeCount = async () => {
  try {
    const statsRef = doc(db, "stats", "recipes");
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      await setDoc(statsRef, { count: 1 });
    } else {
      await updateDoc(statsRef, {
        count: increment(1)
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error incrementing recipe count", error);
    throw error;
  }
};

export const decrementRecipeCount = async () => {
  try {
    const statsRef = doc(db, "stats", "recipes");
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      await setDoc(statsRef, { count: 0 });
    } else {
      await updateDoc(statsRef, {
        count: increment(-1)
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error decrementing recipe count", error);
    throw error;
  }
};

export const incrementFavoriteCount = async () => {
  try {
    const statsRef = doc(db, "stats", "favorites");
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      await setDoc(statsRef, { count: 1 });
    } else {
      await updateDoc(statsRef, {
        count: increment(1)
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error incrementing favorite count", error);
    throw error;
  }
};

export const decrementFavoriteCount = async () => {
  try {
    const statsRef = doc(db, "stats", "favorites");
    const statsDoc = await getDoc(statsRef);
    
    if (!statsDoc.exists()) {
      await setDoc(statsRef, { count: 0 });
    } else {
      await updateDoc(statsRef, {
        count: increment(-1)
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error decrementing favorite count", error);
    throw error;
  }
};

export const getSearchCount = async () => {
  try {
    const statsDoc = await getDoc(doc(db, "stats", "searches"));
    if (!statsDoc.exists()) return 0;
    
    return statsDoc.data().count || 0;
  } catch (error) {
    console.error("Error getting search count", error);
    throw error;
  }
};

export const getRecipeCount = async () => {
  try {
    const statsDoc = await getDoc(doc(db, "stats", "recipes"));
    if (!statsDoc.exists()) return 0;
    
    return statsDoc.data().count || 0;
  } catch (error) {
    console.error("Error getting recipe count", error);
    throw error;
  }
};

export const getFavoriteCount = async () => {
  try {
    const statsDoc = await getDoc(doc(db, "stats", "favorites"));
    if (!statsDoc.exists()) return 0;
    
    return statsDoc.data().count || 0;
  } catch (error) {
    console.error("Error getting favorite count", error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToRecipes = (callback: (recipes: any[]) => void) => {
  try {
    return onSnapshot(collection(db, "recipes"), (querySnapshot) => {
      const recipes: any[] = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() });
      });
      callback(recipes);
    });
  } catch (error) {
    console.error("Error subscribing to recipes", error);
    throw error;
  }
};

export const subscribeToFavorites = (callback: (favorites: string[]) => void) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      callback([]);
      return () => {};
    }
    
    return onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (!doc.exists()) {
        callback([]);
        return;
      }
      
      const userData = doc.data();
      callback(userData.favorites || []);
    });
  } catch (error) {
    console.error("Error subscribing to favorites", error);
    throw error;
  }
};

export const subscribeToAuth = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth, db };
