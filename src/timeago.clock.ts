import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';
import { expand, skip } from 'rxjs/operators';
import { DAY, HOUR, MINUTE } from './util';

export abstract class TimeagoClock {
  abstract tick(then: number): Observable<any>;
}

@Injectable()
export class TimeagoDefaultClock extends TimeagoClock {
  tick(then: number): Observable<any> {
    return of(0)
      .pipe(
        expand(() => {
          const now = Date.now();
          const seconds = Math.round(Math.abs(now - then) / 1000);

          const period =
            seconds < MINUTE
              ? 1000
              : seconds < HOUR
                ? 1000 * MINUTE
                : seconds < DAY
                  ? 1000 * HOUR
                  : 0;

          return period ? timer(period) : Observable.empty<never>();
        }),
        skip(1)
      );
  }
}
