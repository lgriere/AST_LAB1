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
		  expect(err).to.be.null
		  expect(result).to.not.be.undefined
		  expect(result).to.not.be.an('array')
		  expect(result).to.be.empty
		})
	  })
	})
	
	describe('#save', function () {
		it('should save data', function () {
		const data = [ new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,12)]
		dbMet.save("1", data, (err: Error | null) => {
			// expect(err).to.be.null
			expect(dbMet[1]).to.equal(data)
		  })
		})

		it('should update data', function () {
			const data = [ new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,12)]
			dbMet.save("1", data, (err: Error | null) => {
				// expect(err).to.be.null
				expect(dbMet[1]).to.equal(data)
			})
			const updatedData = [ new Metric(`${new Date('2013-11-04 14:30 UTC').getTime()}`,15)]
			dbMet.save("1", updatedData, (err: Error | null) => {
				// expect(err).to.be.null
				expect(dbMet[1]).to.equal(updatedData)
			})
		})
	})

  describe('#delete', function () {
    it('should delete data', function () {
      const data = [ new Metric(`${new Date('2013-11-04 14:00 UTC').getTime()}`,12)]
			dbMet.save("2", data, (err: Error | null) => {
				expect(err).to.be.null
				expect(dbMet[1]).to.equal(data)
			})
			dbMet.remove("2", (err: Error | null) => {
				expect(err).to.be.null
				expect(dbMet[1]).to.be.undefined
			})
    })

    it('should not fail if data does not exist', function () {
      dbMet.remove("2", (err: Error | null) => {
			expect(err).to.be.null
			expect(dbMet[1]).to.be.undefined
		})
    })
  })
  
})



