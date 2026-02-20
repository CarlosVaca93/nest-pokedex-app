import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit') || 10;

  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase().trim();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }


  findAll( paginationDto: PaginationDto) {
    const {limit= this.defaultLimit,offset = 0} = paginationDto;
    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({no:1})
    .select('-__v');
  }

 async findOne(term: string) {  
    if (!isNaN(+term)) {
      const pokemon = await this.pokemonModel.findOne({ no: +term });
      if (!pokemon) {
        throw new BadRequestException(`Pokemon with id ${term} not found`);
      }
      return pokemon;
    }

    if(isValidObjectId(term)){
      const pokemon = await this.pokemonModel.findById(term);
      if (!pokemon) {
        throw new BadRequestException(`Pokemon with id ${term} not found`);
      }
      return pokemon;
    }

    term = term.toLocaleLowerCase().trim();
    const pokemon = await this.pokemonModel.findOne({ name: term });
    if (!pokemon) {
      throw new BadRequestException(`Pokemon with name ${term} not found`);
    }
    return pokemon;   
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if(updatePokemonDto.name){
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();
    }
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }   
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    //  return pokemon;
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    // if (!result) {
    //   throw new BadRequestException(`Pokemon with id ${id} not found`);
    // }
    const {deletedCount} = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Error creating pokemon - Check server logs for more details`);
  }

}
