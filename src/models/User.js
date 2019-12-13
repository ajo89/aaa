const { model, Schema } = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator').default

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email address')
        }
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign(
    { _id: this._id.toString() },
    process.env.APP_SECRET || 'supersecret'
  )

  this.tokens.push({ token })
  await this.save()

  return token
}

UserSchema.methods.toSafeObject = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
  }
}

UserSchema.statics.findByCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('User not found')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid password')
  }

  return user
}

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

const User = model('User', UserSchema)

module.exports = User
