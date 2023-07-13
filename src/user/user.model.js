import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
})

userSchema.set('toJSON', {
  transform(doc, ret) {
    ret._id = ret._id.toString()
    delete ret.__v
    return ret
  },
})

export default mongoose.model('User', userSchema)
