import { BadRequestException, Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';

import TaskRepository from '../../Repositories/TaskRepository';

@Injectable()
export default class SaveTaskUseCase implements UseCase<Promise<Task>, [dto: SaveTaskDto]> {
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto) : Promise<Task> {
    /*
    * @todo IMPLEMENT HERE : VALIDATION DTO, DATA SAVING, ERROR CATCHING
     */
    if (!dto.name || dto.name.trim() === ''){
      throw new BadRequestException('Name required')
    }
    
    try {
      const task = await this.taskRepository.save(dto);
      return task;
    }catch (error){
      console.error('Error: ', error);
      throw new BadRequestException('Failed save')
    }
  }
}
