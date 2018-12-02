import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'

export class User {
  public username: string
  public email: string
  private password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
    this.username = username
    this.email = email

    if (!passwordHashed) {
      this.setPassword(password)
    } else this.password = password
  }
  
 

  public setPassword(toSet: string): void {
    // Hash and set password
	// LOOK AT BCRYPT
	this.password = toSet

	}

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: String): boolean {
    // return comparison with hashed password
	return this.password === toValidate
  }
  
   static fromDb(username:string, value: any): User {
    // Parse db result and return a User
	const [password, email] = value.key.split(":")
	return new User (username, email, password)
  }
}

export class UserHandler {
  public db: any
  
  constructor(path: string) {
    this.db = LevelDB.open(path)
  }

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)
      else callback(null, User.fromDb(username, data))
    })
  }

  public save(user: User, callback: (err: Error | null) => void) {
    this.db.put(
      `user:${user.username}`,
      `${user.getPassword}:${user.email}`,
      (err: Error | null) => {
      callback(err)
      }
    )
  }


  public delete(username: string, callback: (err: Error | null) => void) {
    // TODO
  }

}