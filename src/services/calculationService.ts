import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

export interface Calculation {
    id: string;
    userId: string;
    carbs: number;
    currentGlucose: number;
    targetGlucose: number;
    isf: number;
    icr: {
        normal: number;
        morning: number;
        selected: 'normal' | 'morning';
    };
    insulinForCarbs: number;
    correctionInsulin: number;
    totalInsulin: number;
    timestamp: Date;
}

export const saveCalculation = async (calculation: Omit<Calculation, 'userId' | 'timestamp'>) => {
    const auth = getAuth();
    const db = getFirestore();
    
    if (!auth.currentUser) {
        throw new Error('Usuário não autenticado');
    }

    const calculationWithUser = {
        ...calculation,
        userId: auth.currentUser.uid,
        timestamp: new Date()
    };

    try {
        const docRef = await addDoc(collection(db, 'calculations'), calculationWithUser);
        return docRef.id;
    } catch (error) {
        console.error('Erro ao salvar cálculo:', error);
        throw error;
    }
};

export const getCalculations = async () => {
    const auth = getAuth();
    const db = getFirestore();
    
    if (!auth.currentUser) {
        throw new Error('Usuário não autenticado');
    }

    const q = query(
        collection(db, 'calculations'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
    );

    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Calculation[];
    } catch (error) {
        console.error('Erro ao buscar cálculos:', error);
        throw error;
    }
}; 