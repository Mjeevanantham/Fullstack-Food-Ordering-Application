import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CountryScopeInterceptor } from '../common/interceptors/country-scope.interceptor';
import { CheckAbility } from '../common/decorators/check-ability.decorator';
import { Action, Subject } from '../common/enums/ability.enum';

@ApiTags('restaurants')
@Controller('restaurants')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CountryScopeInterceptor)
@ApiBearerAuth()
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @CheckAbility(Action.Read, Subject.Restaurant)
  @ApiOperation({ summary: 'Get all restaurants with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('country') countryId?: string,
    @CurrentUser() user?: any
  ) {
    return this.restaurantsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
      search,
      countryId,
      user?.role,
      user?.countryId
    );
  }

  @Get(':id')
  @CheckAbility(Action.Read, Subject.Restaurant)
  @ApiOperation({ summary: 'Get restaurant by ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.restaurantsService.findOne(id, user?.role, user?.countryId);
  }

  @Get(':id/menu')
  @CheckAbility(Action.Read, Subject.MenuItem)
  @ApiOperation({ summary: 'Get menu items for a restaurant' })
  async findMenuItems(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.restaurantsService.findMenuItems(id, user?.role, user?.countryId);
  }
}

