import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: String,
})

userSchema.set('toJSON', {
  transform(doc, ret) {
    ret._id = ret._id.toString()
    delete ret.__v
    delete ret.password
    return ret
  },
})

export default mongoose.model('User', userSchema)
