import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test/metrics'
var dbMet: MetricsHandler

describe('Metrics', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.db.close()
  })

	describe('#get', function () {
	  it('should get empty array on non existing group', function () {
		dbMet.get("0",(err: Error | null, result?: Metric[]) => {
		  // expect(err).to.be.null
		  expect(result).to.not.be.undefined
		  expect(result).to.be.an('array')
		  expect(result).to.be.empty
		})
	  })
	})
	
	describe('#save', function () {
		const data = [ new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,12)]
		
		it('should save data', function (done) {
		dbMet.save("1", data, (err: Error | null) => {
			expect(err).to.be.undefined
			dbMet.get("1",(err: Error | null, result?: Metric[]) => {
			  expect(result).to.be.an('array')
			  expect(result).to.be.eql(data)
			  done()
			})
		  })
		})

		it('should update data', function (done) {
			dbMet.save("1", data, (err: Error | null) => {
				expect(err).to.be.undefined
				const updatedData = [ new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,15)]
				dbMet.save("1", updatedData, (err: Error | null) => {
					expect(err).to.be.undefined
					dbMet.get("1",(err: Error | null, result?: Metric[]) => {
					  expect(result).to.be.eql(updatedData)
					  done()
					})
					
				})
			})
			
		})
	})

  describe('#delete', function () {
	  before(function (done) {
		  const data = [new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,12)]
		  dbMet.save("2", data, (err: Error | null) => {
			done()
		  })
		})
  
  
    it('should delete data', function (done) {
			dbMet.remove("2", (err: Error | null) => {
				expect(err).to.be.null
				dbMet.get("2",(err: Error | null, result?: Metric[]) => {
					expect(result).to.not.be.undefined
					expect(result).to.be.an('array')
					expect(result).to.be.empty
				  done()
				})
			})
    })

    it('should not fail if data does not exist', function (done) {
      dbMet.remove("3", (err: Error | null) => {
				expect(err).to.be.null
				dbMet.get("3",(err: Error | null, result?: Metric[]) => {
				  done()
				})
			})
    })
  })
  
})



