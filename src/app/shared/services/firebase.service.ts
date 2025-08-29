import { Injectable, inject } from '@angular/core';
import {
  DocumentData,
  Firestore,
  QueryConstraint,
  Timestamp,
  WriteBatch,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from '@angular/fire/firestore';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface FirebaseDocument {
  id?: string;
  [key: string]: any;
}

export interface QueryOptions {
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
  limitCount?: number;
  whereConditions?: {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
    value: any;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly firestore = inject(Firestore);

  /**
   * Get a collection with query options
   */
  public getCollection<T extends FirebaseDocument>(collectionName: string, options?: QueryOptions): Observable<T[]> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const queryConstraints = this.buildQueryConstraints(options);

      const q = queryConstraints.length > 0 ? query(collectionRef, ...queryConstraints) : collectionRef;

      return collectionData(q, { idField: 'id' }).pipe(
        map((data: DocumentData[]) => data as T[]),
        catchError(error => this.handleError(error, `getCollection(${collectionName})`))
      );
    } catch (error) {
      return throwError(() => new Error(`Failed to create query for collection ${collectionName}: ${error}`));
    }
  }

  /**
   * Get a single document by ID
   */
  public getDocument<T extends FirebaseDocument>(collectionName: string, documentId: string): Observable<T | null> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);

      return docData(docRef, { idField: 'id' }).pipe(
        map((data: DocumentData | undefined) => (data ? (data as T) : null)),
        catchError(error => this.handleError(error, `getDocument(${collectionName}/${documentId})`))
      );
    } catch (error) {
      return throwError(
        () => new Error(`Failed to create document reference ${collectionName}/${documentId}: ${error}`)
      );
    }
  }

  /**
   * Add a new document to a collection
   */
  public async addDocument<T extends Partial<FirebaseDocument>>(collectionName: string, data: T): Promise<string> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const documentData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collectionRef, documentData);
      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to add document to ${collectionName}: ${error}`);
    }
  }

  /**
   * Update an existing document
   */
  public async updateDocument<T extends Partial<FirebaseDocument>>(
    collectionName: string,
    documentId: string,
    data: T
  ): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
    } catch (error) {
      throw new Error(`Failed to update document ${collectionName}/${documentId}: ${error}`);
    }
  }

  /**
   * Delete a document
   */
  public async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, documentId);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(`Failed to delete document ${collectionName}/${documentId}: ${error}`);
    }
  }

  /**
   * Create a batch for multiple operations
   */
  public createBatch(): WriteBatch {
    return writeBatch(this.firestore);
  }

  /**
   * Get server timestamp
   */
  public getServerTimestamp(): Timestamp {
    return serverTimestamp() as Timestamp;
  }

  /**
   * Build query constraints from options
   */
  private buildQueryConstraints(options?: QueryOptions): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];

    if (!options) return constraints;

    // Add where conditions
    if (options.whereConditions) {
      options.whereConditions.forEach(condition => {
        constraints.push(where(condition.field, condition.operator, condition.value));
      });
    }

    // Add order by
    if (options.orderByField) {
      constraints.push(orderBy(options.orderByField, options.orderDirection || 'asc'));
    }

    // Add limit
    if (options.limitCount && options.limitCount > 0) {
      constraints.push(limit(options.limitCount));
    }

    return constraints;
  }

  /**
   * Handle Firebase errors
   */
  private handleError(error: any, operation: string): Observable<never> {
    console.error(`Firebase ${operation} failed:`, error);

    // You could add more sophisticated error handling here
    // such as user-friendly error messages, retry logic, etc.

    return throwError(() => new Error(`Firebase operation failed: ${operation}`));
  }
}
