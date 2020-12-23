import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {CourseController} from '../controllers'
import {Topic,Course} from '../models';
import {TopicRepository,CourseRepository} from '../repositories';

export class TopicController {
  constructor(
    @repository(TopicRepository)
    public topicRepository : TopicRepository,
    
    @repository(CourseRepository)
    public courseRepository : CourseRepository
  ) {}

  
  
  @post('/topics', {
    responses: {
      '200': {
        description: 'Topic model instance',
        content: {'application/json': {schema: getModelSchemaRef(Topic)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Topic, {
            title: 'NewTopic',
            exclude: ['code'],
          }),
        },
      },
    })
    topic: Omit<Topic, 'code'>,
  ){
    await this.topicRepository.create(topic);
    var t:Topic[] =await this.topicRepository.find();
    var val:Topic = t[t.length-1];
    console.log(val);
    var c:Count =await this.count();
    var id = topic.subject;
    var course:Course = await this.courseRepository.findById(id);
    course.topics.push(val.code);
    console.log(course);  
    await this.courseRepository.updateById(id, course);
    
  }

  @get('/topics/count', {
    responses: {
      '200': {
        description: 'Topic model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Topic) where?: Where<Topic>,
  ): Promise<Count> {
    return this.topicRepository.count(where);
  }

  @get('/topics', {
    responses: {
      '200': {
        description: 'Array of Topic model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Topic, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Topic) filter?: Filter<Topic>,
  ): Promise<Topic[]> {
    return this.topicRepository.find(filter);
  }

  @patch('/topics', {
    responses: {
      '200': {
        description: 'Topic PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Topic, {partial: true}),
        },
      },
    })
    topic: Topic,
    @param.where(Topic) where?: Where<Topic>,
  ): Promise<Count> {
    return this.topicRepository.updateAll(topic, where);
  }

  @get('/topics/{id}', {
    responses: {
      '200': {
        description: 'Topic model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Topic, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Topic, {exclude: 'where'}) filter?: FilterExcludingWhere<Topic>
  ): Promise<Topic> {
    return this.topicRepository.findById(id, filter);
  }

  @patch('/topics/{id}', {
    responses: {
      '204': {
        description: 'Topic PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Topic, {partial: true}),
        },
      },
    })
    topic: Topic,
  ): Promise<void> {
    await this.topicRepository.updateById(id, topic);
  }

  @put('/topics/{id}', {
    responses: {
      '204': {
        description: 'Topic PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() topic: Topic,
  ): Promise<void> {
    await this.topicRepository.replaceById(id, topic);
  }

  @del('/topics/{id}', {
    responses: {
      '204': {
        description: 'Topic DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    
    var topic:Topic =await this.topicRepository.findById(id);
    console.log(topic);
    var i:number =topic.subject; 
    var course:Course = await this.courseRepository.findById(i);
    console.log(course);
    var s:number[] = [];
    var t:number[] = course.topics;
    t.forEach(function (value) {
      if(value!==id)
      s.push(value);
    }); 
    course.topics=s;
    await this.courseRepository.updateById(i, course);

    await this.topicRepository.deleteById(id);
  }
}
