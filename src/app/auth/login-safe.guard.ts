import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileSessionService } from '../services/profile-session.service';

export const loginSafeGuard: CanActivateFn = (route, state) => {
  const _profileService = inject(ProfileSessionService);
  const _router = inject(Router);

  if(!_profileService.getProfileSession()){
    return true;
  } else {
    _router.navigate(['']);
    return false;
  }
};
