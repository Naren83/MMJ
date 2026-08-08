import { Pipe, PipeTransform } from '@angular/core';
import { CaseStatus } from '../../core/models/mortgage-case.model';

@Pipe({ name: 'statusKey', standalone: true })
export class StatusKeyPipe implements PipeTransform {
  transform(status: CaseStatus | string): string {
    return status.toLowerCase().replaceAll(' ', '-');
  }
}
