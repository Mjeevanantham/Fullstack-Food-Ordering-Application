import { Injectable } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Action, Subject } from '../enums/ability.enum';
import { Role } from '../enums/role.enum';
import { User, Restaurant, MenuItem, Order, PaymentMethod } from '@prisma/client';

type Subjects = InferSubjects<typeof Restaurant | typeof MenuItem | typeof Order | typeof PaymentMethod | typeof User | 'all'> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  createForUser(user: User & { country?: { id: string } }) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>
    );

    if (user.role === Role.ADMIN) {
      // Admin can do everything
      can(Action.Manage, Subject.All);
    } else if (user.role === Role.MANAGER) {
      // Manager can view restaurants & menu, create order, checkout, cancel order
      can(Action.Read, Subject.Restaurant);
      can(Action.Read, Subject.MenuItem);
      can(Action.Create, Subject.Order);
      can([Action.Update, Action.Delete], Subject.Order);
    } else if (user.role === Role.MEMBER) {
      // Member can view restaurants & menu, create order
      can(Action.Read, Subject.Restaurant);
      can(Action.Read, Subject.MenuItem);
      can(Action.Create, Subject.Order);
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

