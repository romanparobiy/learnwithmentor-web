import { Injectable } from '@angular/core';
import { States } from './../../specific-group/specific-plan/states';

@Injectable({
    providedIn: 'root'
  })
  export class ImageService {

    setImage(state: States): string {
        let path: string;
        switch (state) {
            case States.done: {
                path = '../../../assets/images/done.png';
                break;
            }
            case States.approved: {
                path = '../../../assets/images/approved.png';
                break;
            }
            case States.inProgress: {
                path = '../../../assets/images/inprogress.png';
                break;
            }
            case States.rejected: {
                path = '../../../assets/images/rejected.png';
                break;
            }
            case States.reset: {
                path = '../../../assets/images/inprogress.png';
                break;
            }
        }
        return path;
    }
  }
