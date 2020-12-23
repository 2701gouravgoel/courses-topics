import {DefaultCrudRepository} from '@loopback/repository';
import {Topic, TopicRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TopicRepository extends DefaultCrudRepository<
  Topic,
  typeof Topic.prototype.code,
  TopicRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Topic, dataSource);
  }
}
