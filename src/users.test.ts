import { expect } from 'chai'
import { User, UserHandler } from './users'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test/users'
var dbUser: UserHandler

describe('Users', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbUser = new UserHandler(dbPath)
  })

  after(function () {
    dbUser.db.close()
  })

  describe('#get', function () {
    it('should get undefined on non existing User', function (done) {
      dbUser.get("unexistant", function (err: Error | null, result?: User) {
         expect(result).to.be.undefined
         done()
      })
    })
  })

  describe('#save', function () {
    const user = new User("Test","test@test.com","test")
    it('should save a User', function (done) {
      dbUser.save(user, function (err: Error | null) {
         dbUser.get("Test", function (err: Error | null, result?: User) {
            expect(result).to.be.eql(user)
            done()
             })
         })
    })

    it('should update a User', function (done) {
      dbUser.save(user, (err: Error | null) => {
        expect(err).to.be.undefined
        const updateUser = new User("Test", "test@test.com", "test2")
        dbUser.save(updateUser, (err: Error | null) => {
          expect(err).to.be.undefined
          dbUser.get("Test", (err: Error | null, result?: User) => {
            expect(err).to.be.null
            expect(result).to.eql(updateUser)
            done()
          })
        })
      })
    })
  })

  describe('#delete', function () {
    before(function (done) {
      const user = new User("test", "test@test.com", "test")
      dbUser.save(user, (err: Error | null) => {
        expect(err).to.be.undefined
        done()
      })
    })
    it('should delete a User', function (done) {
      dbUser.remove("del", (err: Error | null) => {
        expect(err).to.be.undefined
        dbUser.get("del", (err: Error | null, result?: User) => {
          expect(result).to.be.undefined
          done()
        })
      })
    })

    it('should not fail if User does not exist', function (done) {
      dbUser.remove("unexistant", (err: Error | null) => {
          expect(err).to.be.undefined
          done()
      })
    })
  })
})
