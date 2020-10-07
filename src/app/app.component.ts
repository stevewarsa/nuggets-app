import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { MemoryService } from './memory.service';
import { StringUtils } from './string.utils';

@Component({
  selector: 'mem-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bible Nuggets';
  user: string = null;
  subscription: Subscription;

  constructor(private memoryService: MemoryService, private router: Router) { }

  ngOnInit() {
    this.user = this.memoryService.getCurrentUser();
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.user = this.memoryService.getCurrentUser();
      }
    });
    let dest = StringUtils.getParameterByName('dest');
    if (!StringUtils.isEmpty(dest)) {
      if (!this.user) {
        // allow anyone to be sent a link and not have to login
        this.memoryService.setCurrentUser(this.memoryService.GUEST_USER);
      }
      // preserve the query parameters sent in to this route to be passed to next route
      const url = window.location.href;
      const params = url.indexOf('?') !== -1 ? url.slice(url.indexOf('?') + 1)
                  .split('&')
                  // tslint:disable:no-any
                  .reduce((params: any, param) => {
                      const [key, value] = param.split('=');
                      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                      return params;
                  }, {}) : {};
      let navigationExtras: NavigationExtras = {
        queryParamsHandling: 'merge',
        preserveFragment: true,
        queryParams: params
      };
      this.router.navigate([dest], navigationExtras);
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
