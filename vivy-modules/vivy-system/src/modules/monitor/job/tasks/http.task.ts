import { Injectable } from '@nestjs/common'
import { Taskable } from '../utils/taskable.decorator'

@Taskable()
@Injectable()
export class HttpTask {
  calc() {
    console.log('计算大数据')
  }
}
