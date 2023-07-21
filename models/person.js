const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const uri = process.env.MONGODB_URI

console.log('connecting to ', uri)



mongoose.connect(uri)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB: ', err)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must contain at least 3 characters'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    validate: [
      {
        validator: (v) => v.length >= 8,
        message: 'Number must contain at least 8 characters'
      },
      {
        validator: function(v) {
          let regex1 = /^\d{2,3}-\d+/i
          return regex1.test(v)
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    ],
    required: [true, 'Number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
