import { ChangeDetectorRef, Injectable, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TickerOverride, TimeagoClock } from './timeago.clock';
import { TimeagoFormatter } from './timeago.formatter';
import { TimeagoIntl } from './timeago.intl';
import { coerceBooleanProperty, dateParser, isDefined } from './util';

@Injectable()
@Pipe({
  name: 'timeago',
  pure: false, // required to update the value when stateChanges emits
})
export class TimeagoPipe implements PipeTransform, OnDestroy {
  private intlSubscription: Subscription;
  private clockSubscription: Subscription;

  private date: number;
  private value: string;
  private live = true;

  /**
   * Emits on:
   * - Input change
   * - Intl change
   * - Clock tick
  */
  stateChanges = new Subject<void>();

  constructor(@Optional() intl: TimeagoIntl,
    cd: ChangeDetectorRef,
    formatter: TimeagoFormatter,
    private clock: TimeagoClock) {
    if (intl) {
      this.intlSubscription = intl.changes.subscribe(() => this.stateChanges.next());
    }
    this.stateChanges.subscribe(() => {
      this.value = formatter.format(this.date);
      cd.markForCheck();
    });
  }

  transform(date: number, _live: boolean, tickerOverride: TickerOverride) {
    const _date = dateParser(date).valueOf();

    _live = isDefined(_live)
      ? coerceBooleanProperty(_live)
      : this.live;

    if (this.date === _date && this.live === _live) {
      return this.value;
    }

    this.date = _date;
    this.live = _live;

    if (this.date) {
      if (this.clockSubscription) {
        this.clockSubscription.unsubscribe();
        this.clockSubscription = undefined;
      }
      this.clockSubscription = this.clock.tick(this.date, tickerOverride)
        .pipe(filter(() => this.live, this))
        .subscribe(() => this.stateChanges.next());
      this.stateChanges.next();
    } else {
      throw new SyntaxError(`Wrong parameter in TimeagoPipe. Expected a valid date, received: ${date}`);
    }

    return this.value;
  }

  ngOnDestroy() {
    if (this.intlSubscription) {
      this.intlSubscription.unsubscribe();
      this.intlSubscription = undefined;
    }
    if (this.clockSubscription) {
      this.clockSubscription.unsubscribe();
      this.clockSubscription = undefined;
    }
    this.stateChanges.complete();
  }
}
