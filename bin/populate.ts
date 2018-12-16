#!/usr/bin/env ts-node
import {Metric, MetricsHandler} from '../src/metrics'
import {User, UserHandler} from '../src/users'
const moment = require('moment');

const metTest = [
  new Metric(`${moment.utc('2013-11-16T14:00').format("X")}`,12),
  new Metric(`${moment.utc('2013-11-16T14:15').format("X")}`,10),
  new Metric(`${moment.utc('2013-11-16T14:30').format("X")}`,8)
]

const metLisa = [
  new Metric(`${moment.utc('2018-12-16T07:07').format("X")}`,7),
  new Metric(`${moment.utc('2018-12-16T14:00').format("X")}`,14),
  new Metric(`${moment.utc('2018-12-16T16:16').format("X")}`,16)
]

const users = [
  new User("Test", "test@test.com", "test"),
  new User("Lisa", "lisa.griere@edu.ece.fr", "lisa")
]

const dbMet = new MetricsHandler('./db/metrics')

dbMet.save("Test", metTest, (err: Error | null) => {
  if (err) throw err
  console.log('Test\'s Metrics populated')
})

dbMet.save("Lisa", metLisa, (err: Error | null) => {
  if (err) throw err
  console.log('Lisa\'s Metrics populated')
})

dbMet.db.close()
while(dbMet.db.isOpen()){}

const dbUsers = new UserHandler('./db/users')

users.forEach((user: User) => {
  dbUsers.save(user, (err: Error | null) => {
    if (err) throw err
  })
})
dbUsers.db.close()

console.log("Users populated")
console.log("Username : Test \nPassword : test \n\nUsername : Lisa \nPassword : lisa\n\n")
