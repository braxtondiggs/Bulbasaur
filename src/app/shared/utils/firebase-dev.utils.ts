import { Injectable, inject, isDevMode } from '@angular/core';
import { FirebaseDocument, FirebaseService, QueryOptions } from '@shared/services/firebase.service';
import { Observable, finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDevUtils {
  private readonly firebaseService = inject(FirebaseService);

  /**
   * Get collection with development insights and performance monitoring
   */
  public getCollectionWithDevInsights<T extends FirebaseDocument>(
    collectionName: string,
    options?: QueryOptions
  ): Observable<T[]> {
    if (!isDevMode()) {
      // In production, just return the normal service call
      return this.firebaseService.getCollection<T>(collectionName, options);
    }

    const startTime = performance.now();

    // eslint-disable-next-line no-console
    console.group(`[Firebase Dev] Query: ${collectionName}`);
    // eslint-disable-next-line no-console
    console.log('Options:', options);
    // eslint-disable-next-line no-console
    console.log('Start time:', new Date().toISOString());

    return this.firebaseService.getCollection<T>(collectionName, options).pipe(
      tap(data => {
        const endTime = performance.now();
        // eslint-disable-next-line no-console
        console.log(`Query completed in ${(endTime - startTime).toFixed(2)}ms`);
        // eslint-disable-next-line no-console
        console.log('Results count:', data.length);
        // eslint-disable-next-line no-console
        console.log('Sample data:', data.slice(0, 2)); // Log first 2 items for debugging
      }),
      finalize(() => {
        // eslint-disable-next-line no-console
        console.groupEnd();
      })
    );
  }

  /**
   * Analyze query performance and provide suggestions
   */
  public analyzeQuery(collectionName: string, options?: QueryOptions): void {
    if (!isDevMode()) {
      return;
    }

    // eslint-disable-next-line no-console
    console.group(`[Firebase Dev Query Analyzer] ${collectionName}`);

    // Analyze query complexity
    let complexity = 'Simple';
    const suggestions: string[] = [];

    if (options?.whereConditions && options.whereConditions.length > 2) {
      complexity = 'Complex';
      suggestions.push('Consider using composite indexes for multiple where conditions');
    }

    if (options?.limitCount && options.limitCount > 100) {
      suggestions.push('Large limit detected - consider pagination for better performance');
    }

    if (options?.orderByField && options?.whereConditions) {
      suggestions.push('Ensure your Firestore indexes support this query combination');
    }

    // eslint-disable-next-line no-console
    console.log('Query Complexity:', complexity);
    if (suggestions.length > 0) {
      // eslint-disable-next-line no-console
      console.log('Performance Suggestions:', suggestions);
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  /**
   * Profile a query with timing information
   */
  public profileQuery<T>(operationName: string, queryFunction: () => Observable<T>): Observable<T> {
    if (!isDevMode()) {
      return queryFunction();
    }

    const startTime = performance.now();
    // eslint-disable-next-line no-console
    console.time(`[Firebase Profile] ${operationName}`);

    return queryFunction().pipe(
      finalize(() => {
        const endTime = performance.now();
        // eslint-disable-next-line no-console
        console.timeEnd(`[Firebase Profile] ${operationName}`);
        // eslint-disable-next-line no-console
        console.log(`[Firebase Profile] ${operationName} took ${(endTime - startTime).toFixed(2)}ms`);
      })
    );
  }

  /**
   * Validate Firebase data structure
   */
  public validateFirebaseData<T extends FirebaseDocument>(
    data: T[],
    collectionName: string,
    requiredFields: string[]
  ): boolean {
    if (!isDevMode()) {
      return true;
    }

    // eslint-disable-next-line no-console
    console.group(`[Firebase Validator] ${collectionName}`);

    let isValid = true;
    const issues: string[] = [];

    data.forEach((item, index) => {
      requiredFields.forEach(field => {
        if (!Object.prototype.hasOwnProperty.call(item, field) || item[field] === undefined || item[field] === null) {
          issues.push(`Item ${index}: Missing required field '${field}'`);
          isValid = false;
        }
      });

      // Check for common data issues
      if (item.id && typeof item.id !== 'string') {
        issues.push(`Item ${index}: ID should be a string`);
        isValid = false;
      }
    });

    if (issues.length > 0) {
      console.warn('Data validation issues found:', issues);
    } else {
      // eslint-disable-next-line no-console
      console.log('✓ All data validation checks passed');
    }

    // eslint-disable-next-line no-console
    console.log('Data sample:', data.slice(0, 1));
    // eslint-disable-next-line no-console
    console.groupEnd();

    return isValid;
  }

  /**
   * Log Firebase operation for debugging
   */
  public logOperation(operation: string, details: unknown): void {
    if (!isDevMode()) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log(`[Firebase Operation] ${operation}`, {
      timestamp: new Date().toISOString(),
      details
    });
  }
}
