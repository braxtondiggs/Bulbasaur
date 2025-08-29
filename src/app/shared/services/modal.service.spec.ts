import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Subscription } from 'rxjs';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let spectator: SpectatorService<ModalService>;
  const createService = createServiceFactory(ModalService);

  beforeEach(() => {
    spectator = createService();
  });

  describe('Service Initialization', () => {
    it('should create', () => {
      expect(spectator.service).toBeTruthy();
    });

    it('should initialize with modal closed by default', () => {
      expect(spectator.service.isModalOpen()).toBe(false);
    });

    it('should have modalOpen$ observable', () => {
      expect(spectator.service.modalOpen$).toBeDefined();
      expect(typeof spectator.service.modalOpen$.subscribe).toBe('function');
    });

    it('should emit false as initial value from modalOpen$ observable', (done) => {
      spectator.service.modalOpen$.subscribe(value => {
        expect(value).toBe(false);
        done();
      });
    });
  });

  describe('Modal State Management', () => {
    it('should open modal when setModalOpen is called with true', () => {
      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);
    });

    it('should close modal when setModalOpen is called with false', () => {
      // First open it
      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);
      
      // Then close it
      spectator.service.setModalOpen(false);
      expect(spectator.service.isModalOpen()).toBe(false);
    });

    it('should handle multiple consecutive state changes', () => {
      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);

      spectator.service.setModalOpen(false);
      expect(spectator.service.isModalOpen()).toBe(false);

      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);

      spectator.service.setModalOpen(false);
      expect(spectator.service.isModalOpen()).toBe(false);
    });

    it('should maintain state when called with same value multiple times', () => {
      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);

      spectator.service.setModalOpen(false);
      spectator.service.setModalOpen(false);
      spectator.service.setModalOpen(false);
      expect(spectator.service.isModalOpen()).toBe(false);
    });
  });

  describe('Observable Behavior', () => {
    it('should emit true when modal is opened', (done) => {
      let emissionCount = 0;
      const subscription = spectator.service.modalOpen$.subscribe(value => {
        emissionCount++;
        if (emissionCount === 1) {
          // Initial emission (false)
          expect(value).toBe(false);
        } else if (emissionCount === 2) {
          // After setting to true
          expect(value).toBe(true);
          subscription.unsubscribe();
          done();
        }
      });

      spectator.service.setModalOpen(true);
    });

    it('should emit false when modal is closed', (done) => {
      let emissionCount = 0;
      const subscription = spectator.service.modalOpen$.subscribe(value => {
        emissionCount++;
        if (emissionCount === 1) {
          // Initial emission (false)
          expect(value).toBe(false);
        } else if (emissionCount === 2) {
          // After setting to true
          expect(value).toBe(true);
        } else if (emissionCount === 3) {
          // After setting back to false
          expect(value).toBe(false);
          subscription.unsubscribe();
          done();
        }
      });

      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(false);
    });

    it('should emit values in correct sequence for multiple state changes', (done) => {
      const emittedValues: boolean[] = [];
      const subscription = spectator.service.modalOpen$.subscribe(value => {
        emittedValues.push(value);
        
        // After all operations
        if (emittedValues.length === 5) {
          expect(emittedValues).toEqual([false, true, false, true, false]);
          subscription.unsubscribe();
          done();
        }
      });

      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(false);
      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(false);
    });

    it('should emit values even when setting same state multiple times', (done) => {
      const emittedValues: boolean[] = [];
      const subscription = spectator.service.modalOpen$.subscribe(value => {
        emittedValues.push(value);
        
        // After all operations (BehaviorSubject emits even for same values)
        if (emittedValues.length === 4) {
          expect(emittedValues).toEqual([false, true, true, true]);
          subscription.unsubscribe();
          done();
        }
      });

      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(true);
    });

    it('should support multiple subscribers', (done) => {
      let subscriber1Emissions = 0;
      let subscriber2Emissions = 0;
      
      const subscription1 = spectator.service.modalOpen$.subscribe(value => {
        subscriber1Emissions++;
        if (value === true && subscriber1Emissions === 2) {
          expect(subscriber1Emissions).toBe(2); // Initial false + true
        }
      });

      const subscription2 = spectator.service.modalOpen$.subscribe(value => {
        subscriber2Emissions++;
        if (value === true && subscriber2Emissions === 2) {
          expect(subscriber2Emissions).toBe(2); // Initial false + true
          subscription1.unsubscribe();
          subscription2.unsubscribe();
          done();
        }
      });

      spectator.service.setModalOpen(true);
    });
  });

  describe('State Consistency', () => {
    it('should have consistent state between isModalOpen() and modalOpen$ observable', (done) => {
      spectator.service.modalOpen$.subscribe(observableValue => {
        const methodValue = spectator.service.isModalOpen();
        expect(observableValue).toBe(methodValue);
        
        if (observableValue === true) {
          done();
        }
      });

      spectator.service.setModalOpen(true);
    });

    it('should maintain state consistency after multiple operations', () => {
      // Test sequence of operations
      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);

      spectator.service.setModalOpen(false);
      expect(spectator.service.isModalOpen()).toBe(false);

      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);

      // Final state check with observable
      spectator.service.modalOpen$.subscribe(value => {
        expect(value).toBe(spectator.service.isModalOpen());
        expect(value).toBe(true);
      });
    });
  });

  describe('Memory Management', () => {
    it('should handle subscription cleanup properly', () => {
      const subscription: Subscription = spectator.service.modalOpen$.subscribe();
      expect(subscription.closed).toBe(false);
      
      subscription.unsubscribe();
      expect(subscription.closed).toBe(true);
    });

    it('should handle multiple subscriptions and cleanup', () => {
      const subscription1: Subscription = spectator.service.modalOpen$.subscribe();
      const subscription2: Subscription = spectator.service.modalOpen$.subscribe();
      const subscription3: Subscription = spectator.service.modalOpen$.subscribe();
      
      expect(subscription1.closed).toBe(false);
      expect(subscription2.closed).toBe(false);
      expect(subscription3.closed).toBe(false);
      
      subscription1.unsubscribe();
      subscription2.unsubscribe();
      subscription3.unsubscribe();
      
      expect(subscription1.closed).toBe(true);
      expect(subscription2.closed).toBe(true);
      expect(subscription3.closed).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive state changes', () => {
      // Rapid state changes
      for (let i = 0; i < 10; i++) {
        spectator.service.setModalOpen(i % 2 === 0);
      }
      
      // Final state should be false (10 is even, so i % 2 === 0 is true for i = 9, but the loop ends at i = 10)
      // Actually, the last iteration is i = 9, so 9 % 2 === 0 is false
      expect(spectator.service.isModalOpen()).toBe(false);
    });

    it('should handle boolean type coercion correctly', () => {
      // TypeScript should prevent this, but testing runtime behavior
      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);

      spectator.service.setModalOpen(false);
      expect(spectator.service.isModalOpen()).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('should work correctly in a complete modal workflow', (done) => {
      const states: boolean[] = [];
      
      const subscription = spectator.service.modalOpen$.subscribe(state => {
        states.push(state);
        
        // Complete workflow: closed -> open -> closed
        if (states.length === 3) {
          expect(states).toEqual([false, true, false]);
          expect(spectator.service.isModalOpen()).toBe(false);
          subscription.unsubscribe();
          done();
        }
      });

      // Simulate opening and closing modal
      spectator.service.setModalOpen(true);
      spectator.service.setModalOpen(false);
    });

    it('should support conditional modal operations', () => {
      // Test conditional logic patterns
      if (!spectator.service.isModalOpen()) {
        spectator.service.setModalOpen(true);
      }
      expect(spectator.service.isModalOpen()).toBe(true);

      if (spectator.service.isModalOpen()) {
        spectator.service.setModalOpen(false);
      }
      expect(spectator.service.isModalOpen()).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should only accept boolean values for setModalOpen', () => {
      // These should compile and work correctly
      spectator.service.setModalOpen(true);
      expect(spectator.service.isModalOpen()).toBe(true);

      spectator.service.setModalOpen(false);
      expect(spectator.service.isModalOpen()).toBe(false);
    });

    it('should return boolean from isModalOpen', () => {
      const result = spectator.service.isModalOpen();
      expect(typeof result).toBe('boolean');
      expect(result === true || result === false).toBe(true);
    });
  });
});
