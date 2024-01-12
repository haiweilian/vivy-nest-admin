import { Injectable } from '@nestjs/common'
import { ServiceException } from '@vivy-common/core'
import { Taskable } from '../utils/taskable.decorator'

@Taskable()
@Injectable()
export class CallTask {
  private log = console.log

  async noParams() {
    this.log('noParams')
  }

  async numberParams(params: number) {
    this.log('numberParams', params)
  }

  async stringParams(params: string) {
    this.log('stringParams', params)
  }

  async booleanParams(params: boolean) {
    this.log('booleanParams', params)
  }

  async objectParams(params: Record<string, any>) {
    this.log('objectParams', params)
  }

  async errorParams(params: unknown) {
    this.log('errorParams', params)
    if (Math.random() > 0.5) {
      throw new Error(`errorParams: Error`)
    } else {
      throw new ServiceException('errorParams: ServiceException')
    }
  }
}
