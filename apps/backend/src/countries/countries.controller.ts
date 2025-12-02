import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('countries')
@Controller('countries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  async findAll() {
    return this.countriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by ID' })
  async findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }
}

