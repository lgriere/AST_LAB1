import {LevelDB} from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}
export class MetricsHandler {
  public db: any

  constructor(path: string) {
    this.db = LevelDB.open(path)
  }

  public save(key: string, met: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)

    stream.on('error', callback)
    stream.on('close', callback)

    met.forEach((m: Metric) => {
      stream.write({ key: `metrics:${key}:${m.timestamp}`, value: m.value })
    })

    stream.end()
  }

  public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []

    stream.on('error', callback)
    .on('end', (err:Error) =>{
      callback(null, met)
    })
    .on('data', (data:any) => {
      const [ , k, timestamp] = data.key.split(":")
      const value = data.value
      console.log(data)
      if (key !== k) {
        console.log(`LevelDB error : ${data} does not match key ${key}`)
      }
      else {
        met.push(new Metric(timestamp, value))
      }
    })
  }


  public remove(key: string, callback: (error: Error | null) => void) {
	const stream = this.db.createReadStream()

	stream.on('error', callback)
    .on('end', (err:Error) =>{
      callback(null)
    })
    .on('data', (data:any) => {
      const [ , k, timestamp] = data.key.split(":")
      if (key === k) {
        this.db.del(data.key)
      }
	  })

  }

}
