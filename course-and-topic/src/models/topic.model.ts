import {Entity, model, property} from '@loopback/repository';

@model()
export class Topic extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  code: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  subject: number;


  constructor(data?: Partial<Topic>) {
    super(data);
  }
}

export interface TopicRelations {
  // describe navigational properties here
}

export type TopicWithRelations = Topic & TopicRelations;
