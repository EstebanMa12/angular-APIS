const {Observable, filter} = require('rxjs');

const doSomething = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Do something 2');
    }, 3000);
  });
}

const doSomething$ = () => {
  return new Observable(observer =>{
    observer.next('Do something 1$');
    observer.next('Do something 2$');
    observer.next(null)
    setTimeout(() => {
      observer.next('Do something 3$');
    }, 5000);
    setTimeout(() => {
      observer.next('Do something 4$');
    }, 6000);
    setTimeout(() => {
      observer.next('Do something 5$');
    }, 7000);
  });
}

(async()=>{
  const rta = await doSomething();
  console.log(rta);
})();

(()=>{
  /**
   * Represents an observable that emits values over time.
   * @typedef {Observable} obs$
   */

  /**
   * Uses the `pipe` operator to apply a series of operators to the observable.
   * The `pipe` operator allows for a more declarative and composable way of manipulating observables.
   *
   * The `subscribe` method is then used to subscribe to the observable and receive the emitted values.
   * Subscribing to an observable is necessary in order to start receiving values from it.
   *
   * @example
   * obs$.pipe(
   *   map(value => value * 2),
   *   filter(value => value > 10)
   * ).subscribe(
   *   value => console.log(value),
   *   error => console.error(error),
   *   () => console.log('Complete')
   * );
   *
   * @param {Function} next - A function that handles the next value emitted by the observable.
   * @param {Function} [error] - A function that handles any error that occurs during the observable execution.
   * @param {Function} [complete] - A function that handles the completion of the observable.
   * @returns {Subscription} A subscription object that can be used to unsubscribe from the observable.
   */
  /**
   * Represents an observable.
   *
   * @type {Observable}
   */
  const obs$ = doSomething$();
  obs$
  .pipe(
    filter(value => value !==null)
  )
  .subscribe(rta=>{
    console.log(rta)
  });
})();
