import { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  getFirestore,
  writeBatch,
  getDoc,
  orderBy
} from 'firebase/firestore';

const db = getFirestore();

export interface Product {
  id?: string;
  name: string;
  unit: string;
  currentQuantity?: number;
  usedQuantity?: number;
  lastUpdate?: Date;
  userId?: string;
  active: boolean;
}

export interface InventoryEntry {
  productId: string;
  quantity: number;
  date: Date;
  userId?: string;
}

export interface InventoryEntryWithDetails extends InventoryEntry {
  id?: string;
  createdAt?: Date;
  products?: Array<{
    name: string;
    unit: string;
    quantity: number;
  }>;
}

export interface BatchEntry {
  id?: string;
  date: Date;
  createdAt?: Date;
  userId?: string;
  products: Array<{
    productId: string;
    quantity: number;
    name?: string;
    unit?: string;
  }>;
}

export const getProducts = async (user: User): Promise<Product[]> => {
  const productsRef = collection(db, 'products');
  const q = query(productsRef, where('userId', '==', user.uid));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    lastUpdate: doc.data().lastUpdate?.toDate()
  })) as Product[];
};

export const addProduct = async (user: User, product: Product): Promise<void> => {
  const productsRef = collection(db, 'products');
  await addDoc(productsRef, {
    ...product,
    userId: user.uid,
    currentQuantity: 0,
    usedQuantity: 0,
    lastUpdate: Timestamp.now(),
    active: true
  });
};

export const updateProduct = async (user: User, product: Product): Promise<void> => {
  if (!product.id) throw new Error('Product ID is required for update');
  
  const productRef = doc(db, 'products', product.id);
  const productDoc = await getDoc(productRef);
  
  if (!productDoc.exists()) {
    throw new Error('Product not found');
  }
  
  const productData = productDoc.data();
  if (productData?.userId !== user.uid) {
    throw new Error('Permission denied');
  }

  await updateDoc(productRef, {
    name: product.name,
    unit: product.unit,
    active: product.active,
    lastUpdate: Timestamp.now()
  });
};

export const deleteProduct = async (user: User, productId: string): Promise<void> => {
  const productRef = doc(db, 'products', productId);
  const productDoc = await getDoc(productRef);
  
  if (!productDoc.exists()) {
    throw new Error('Product not found');
  }
  
  const productData = productDoc.data();
  if (productData?.userId !== user.uid) {
    throw new Error('Permission denied');
  }

  await deleteDoc(productRef);
};

export const registerInventoryEntry = async (user: User, entries: InventoryEntry[]): Promise<void> => {
  const batch = writeBatch(db);
  
  // Agrupa as entradas em um único batch
  const batchEntry = {
    date: entries[0].date,
    userId: user.uid,
    createdAt: new Date(),
    products: entries.map(entry => ({
      productId: entry.productId,
      quantity: entry.quantity
    }))
  };

  // Registra o batch no histórico
  const batchRef = doc(collection(db, 'inventory_batches'));
  batch.set(batchRef, batchEntry);

  // Atualiza a quantidade atual de cada produto
  for (const entry of entries) {
    const productRef = doc(db, 'products', entry.productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error(`Product ${entry.productId} not found`);
    }
    
    const productData = productDoc.data();
    if (productData?.userId !== user.uid) {
      throw new Error(`Permission denied for product ${entry.productId}`);
    }

    batch.update(productRef, {
      currentQuantity: entry.quantity,
      lastUpdate: Timestamp.fromDate(entry.date)
    });
  }

  await batch.commit();
};

export const getInventoryHistory = async (user: User): Promise<BatchEntry[]> => {
  const batchesRef = collection(db, 'inventory_batches');
  const q = query(
    batchesRef,
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const batches = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate(),
    createdAt: doc.data().createdAt.toDate()
  })) as BatchEntry[];

  // Busca os detalhes dos produtos para cada batch
  const productsCache = new Map<string, Product>();
  
  for (const batch of batches) {
    for (const product of batch.products) {
      if (!productsCache.has(product.productId)) {
        const productRef = doc(db, 'products', product.productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          productsCache.set(product.productId, {
            id: productDoc.id,
            ...productDoc.data()
          } as Product);
        }
      }
      
      const productData = productsCache.get(product.productId);
      if (productData) {
        product.name = productData.name;
        product.unit = productData.unit;
      }
    }
  }

  return batches;
};

export const deleteBatch = async (user: User, batchId: string): Promise<void> => {
  const batchRef = doc(db, 'inventory_batches', batchId);
  const batchDoc = await getDoc(batchRef);
  
  if (!batchDoc.exists()) {
    throw new Error('Batch not found');
  }
  
  const batchData = batchDoc.data();
  if (batchData?.userId !== user.uid) {
    throw new Error('Permission denied');
  }

  const batch = writeBatch(db);

  // Exclui o batch
  batch.delete(batchRef);

  // Atualiza as quantidades dos produtos
  for (const product of batchData.products) {
    const productRef = doc(db, 'products', product.productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const productData = productDoc.data();
      if (productData.currentQuantity >= product.quantity) {
        batch.update(productRef, {
          currentQuantity: productData.currentQuantity - product.quantity,
          lastUpdate: Timestamp.now()
        });
      }
    }
  }

  await batch.commit();
};

export const updateBatch = async (user: User, batchId: string, updates: { date: Date; products: Array<{ productId: string; quantity: number }> }): Promise<void> => {
  const batchRef = doc(db, 'inventory_batches', batchId);
  const batchDoc = await getDoc(batchRef);
  
  if (!batchDoc.exists()) {
    throw new Error('Batch not found');
  }
  
  const batchData = batchDoc.data();
  if (batchData?.userId !== user.uid) {
    throw new Error('Permission denied');
  }

  const batch = writeBatch(db);

  // Atualiza o batch
  batch.update(batchRef, {
    date: Timestamp.fromDate(updates.date),
    products: updates.products
  });

  // Atualiza as quantidades dos produtos
  for (const product of updates.products) {
    const productRef = doc(db, 'products', product.productId);
    batch.update(productRef, {
      currentQuantity: product.quantity,
      lastUpdate: Timestamp.fromDate(updates.date)
    });
  }

  await batch.commit();
};

export const useInventoryService = () => {
  return {
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    registerInventoryEntry,
    getInventoryHistory,
    deleteBatch,
    updateBatch
  };
}; 