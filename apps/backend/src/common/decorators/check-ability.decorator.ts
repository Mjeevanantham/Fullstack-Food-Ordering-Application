import { SetMetadata } from '@nestjs/common';
import { Action, Subject } from '../enums/ability.enum';

export interface CheckAbilityOptions {
  action: Action;
  subject: Subject;
}

export const CHECK_ABILITY_KEY = 'check_ability';
export const CheckAbility = (action: Action, subject: Subject) =>
  SetMetadata(CHECK_ABILITY_KEY, { action, subject });

