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
    it('should get undefined on non existing User', function () {
      // TODO
    })
  })

  describe('#save', function () {
    it('should save a User', function () {
      // TODO
    })

    it('should update a User', function () {
      // TODO
    })
  })

  describe('#delete', function () {
    it('should delete a User', function () {
      // TODO
    })

    it('should not fail if User does not exist', function () {
      // TODO
    })
  })
})